package publicaciones.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import publicaciones.config.RabbitMQConfig;
import publicaciones.model.OutboxEvent;
import publicaciones.repository.OutboxEventRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutboxService {

    private final OutboxEventRepository outboxEventRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    public void guardarEvento(UUID aggregateId, String aggregateType, String eventType, Object payload) {
        try {
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setAggregateId(aggregateId);
            outboxEvent.setAggregateType(aggregateType);
            outboxEvent.setEventType(eventType);
            outboxEvent.setPayloadJson(objectMapper.writeValueAsString(payload));
            outboxEvent.setEstado(OutboxEvent.EstadoOutbox.PENDIENTE);
            outboxEvent.setFechaCreacion(LocalDateTime.now());
            
            outboxEventRepository.save(outboxEvent);
            log.info("Evento guardado en outbox: {} - {}", eventType, aggregateId);
        } catch (Exception e) {
            log.error("Error guardando evento en outbox: {}", e.getMessage(), e);
            throw new RuntimeException("Error guardando evento en outbox", e);
        }
    }

    @Scheduled(fixedRate = 5000) // Ejecutar cada 5 segundos
    @Transactional
    public void procesarEventosPendientes() {
        List<OutboxEvent> eventosPendientes = outboxEventRepository.findPendingEvents();
        
        for (OutboxEvent evento : eventosPendientes) {
            try {
                enviarEvento(evento);
                evento.setEstado(OutboxEvent.EstadoOutbox.ENVIADO);
                evento.setFechaEnvio(LocalDateTime.now());
                outboxEventRepository.save(evento);
                log.info("Evento enviado exitosamente: {}", evento.getEventType());
            } catch (Exception e) {
                evento.setEstado(OutboxEvent.EstadoOutbox.ERROR);
                evento.setIntentosEnvio(evento.getIntentosEnvio() + 1);
                evento.setErrorMensaje(e.getMessage());
                outboxEventRepository.save(evento);
                log.error("Error enviando evento: {} - {}", evento.getEventType(), e.getMessage());
            }
        }
    }

    @Scheduled(fixedRate = 30000) // Ejecutar cada 30 segundos
    @Transactional
    public void reintentarEventosFallidos() {
        List<OutboxEvent> eventosFallidos = outboxEventRepository.findFailedEventsWithRetries();
        
        for (OutboxEvent evento : eventosFallidos) {
            try {
                enviarEvento(evento);
                evento.setEstado(OutboxEvent.EstadoOutbox.ENVIADO);
                evento.setFechaEnvio(LocalDateTime.now());
                evento.setErrorMensaje(null);
                outboxEventRepository.save(evento);
                log.info("Evento reenviado exitosamente: {}", evento.getEventType());
            } catch (Exception e) {
                evento.setIntentosEnvio(evento.getIntentosEnvio() + 1);
                evento.setErrorMensaje(e.getMessage());
                outboxEventRepository.save(evento);
                log.error("Error reenviando evento: {} - {}", evento.getEventType(), e.getMessage());
            }
        }
    }

    private void enviarEvento(OutboxEvent evento) {
        String routingKey = determinarRoutingKey(evento.getEventType());
        String exchange = RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE;
        
        rabbitTemplate.convertAndSend(exchange, routingKey, evento.getPayloadJson());
    }

    private String determinarRoutingKey(String eventType) {
        return switch (eventType) {
            case "PublicationSubmitted" -> RabbitMQConfig.PUBLICATION_SUBMITTED_KEY;
            case "ReviewRequested" -> RabbitMQConfig.PUBLICATION_REVIEW_REQUESTED_KEY;
            case "PublicationApproved" -> RabbitMQConfig.PUBLICATION_APPROVED_KEY;
            case "PublicationPublished" -> RabbitMQConfig.PUBLICATION_PUBLISHED_KEY;
            case "UserRegistered" -> RabbitMQConfig.USER_REGISTERED_KEY;
            case "UserLogin" -> RabbitMQConfig.USER_LOGIN_KEY;
            default -> "publication.unknown";
        };
    }

    public List<OutboxEvent> obtenerEventosPorAggregate(UUID aggregateId) {
        return outboxEventRepository.findByAggregateId(aggregateId);
    }

    public List<OutboxEvent> obtenerEventosPorTipo(String eventType) {
        return outboxEventRepository.findByEventType(eventType);
    }
}

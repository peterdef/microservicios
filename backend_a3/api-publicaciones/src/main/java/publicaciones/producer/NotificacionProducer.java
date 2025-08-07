package publicaciones.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import publicaciones.config.RabbitMQConfig;
import publicaciones.dto.NotificacionDto;
import publicaciones.event.*;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    // Método legacy para compatibilidad
    public void enviarNotificacion(String mensaje, String tipo) {
        try {
            NotificacionDto notificacionDto = new NotificacionDto(mensaje, tipo);
            String json = objectMapper.writeValueAsString(notificacionDto);
            rabbitTemplate.convertAndSend("queue.notificaciones", json);
            log.info("Notificación enviada satisfactoriamente: {}", mensaje);
        } catch (Exception e) {
            log.error("Error enviando notificación: {}", e.getMessage(), e);
        }
    }

    // Nuevos métodos para eventos específicos
    public void enviarEventoPublicacionEnviada(UUID publicationId, String userId, String userRole) {
        try {
            PublicationSubmittedEvent event = new PublicationSubmittedEvent();
            event.setPublicationId(publicationId);
            event.setUserId(userId);
            event.setUserRole(userRole);
            
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE,
                RabbitMQConfig.PUBLICATION_SUBMITTED_KEY,
                json
            );
            log.info("Evento PublicationSubmitted enviado para publicación: {}", publicationId);
        } catch (Exception e) {
            log.error("Error enviando evento PublicationSubmitted: {}", e.getMessage(), e);
        }
    }

    public void enviarEventoRevisionSolicitada(UUID publicationId, UUID revisorId, String userId, String userRole) {
        try {
            ReviewRequestedEvent event = new ReviewRequestedEvent();
            event.setPublicationId(publicationId);
            event.setRevisorId(revisorId);
            event.setUserId(userId);
            event.setUserRole(userRole);
            event.setReviewType("BLIND");
            
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE,
                RabbitMQConfig.PUBLICATION_REVIEW_REQUESTED_KEY,
                json
            );
            log.info("Evento ReviewRequested enviado para publicación: {} y revisor: {}", publicationId, revisorId);
        } catch (Exception e) {
            log.error("Error enviando evento ReviewRequested: {}", e.getMessage(), e);
        }
    }

    public void enviarEventoPublicacionAprobada(UUID publicationId, String approvedBy, String comments, String userId, String userRole) {
        try {
            PublicationApprovedEvent event = new PublicationApprovedEvent();
            event.setPublicationId(publicationId);
            event.setApprovedBy(approvedBy);
            event.setApprovalComments(comments);
            event.setUserId(userId);
            event.setUserRole(userRole);
            
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE,
                RabbitMQConfig.PUBLICATION_APPROVED_KEY,
                json
            );
            log.info("Evento PublicationApproved enviado para publicación: {}", publicationId);
        } catch (Exception e) {
            log.error("Error enviando evento PublicationApproved: {}", e.getMessage(), e);
        }
    }

    public void enviarEventoPublicacionPublicada(UUID publicationId, String publicationUrl, String doi, String isbn, String userId, String userRole) {
        try {
            PublicationPublishedEvent event = new PublicationPublishedEvent();
            event.setPublicationId(publicationId);
            event.setPublicationUrl(publicationUrl);
            event.setDoi(doi);
            event.setIsbn(isbn);
            event.setUserId(userId);
            event.setUserRole(userRole);
            
            String json = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE,
                RabbitMQConfig.PUBLICATION_PUBLISHED_KEY,
                json
            );
            log.info("Evento PublicationPublished enviado para publicación: {}", publicationId);
        } catch (Exception e) {
            log.error("Error enviando evento PublicationPublished: {}", e.getMessage(), e);
        }
    }

    public void enviarPublicacionAlCatalogo(publicaciones.dto.CatalogoPublicacionDto dto) {
        try {
            String json = objectMapper.writeValueAsString(dto);
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.PUBLICATION_EVENTS_EXCHANGE,
                RabbitMQConfig.PUBLICATION_PUBLISHED_KEY,
                json
            );
            log.info("Publicación enviada al catálogo: {}", dto.getTitulo());
        } catch (Exception e) {
            log.error("Error enviando publicación al catálogo: {}", e.getMessage(), e);
        }
    }
}

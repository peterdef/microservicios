package ec.edu.espe.notificaciones.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import ec.edu.espe.notificaciones.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificacionListener {

    private final NotificacionService notificacionService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "notifications.activity")
    public void procesarEvento(String mensaje) {
        try {
            log.info("Procesando evento de notificación: {}", mensaje);
            
            // Parsear el mensaje según el tipo de evento
            if (mensaje.contains("PublicationPublished")) {
                procesarPublicacionPublicada(mensaje);
            } else if (mensaje.contains("PublicationApproved")) {
                procesarPublicacionAprobada(mensaje);
            } else if (mensaje.contains("ReviewRequested")) {
                procesarRevisionSolicitada(mensaje);
            } else if (mensaje.contains("UserRegistered")) {
                procesarUsuarioRegistrado(mensaje);
            } else if (mensaje.contains("UserLogin")) {
                procesarUsuarioLogin(mensaje);
            } else {
                log.warn("Tipo de evento no reconocido: {}", mensaje);
            }
            
        } catch (Exception e) {
            log.error("Error procesando evento de notificación: {}", e.getMessage(), e);
        }
    }

    private void procesarPublicacionPublicada(String mensaje) {
        try {
            // Aquí se parsearía el JSON del evento
            // Por simplicidad, usamos datos de ejemplo
            String autorId = "autor-ejemplo-id";
            String autorEmail = "autor@ejemplo.com";
            String tituloPublicacion = "Título de la publicación";
            
            notificacionService.crearNotificacionPublicacionAprobada(
                autorId, autorEmail, tituloPublicacion);
                
        } catch (Exception e) {
            log.error("Error procesando publicación publicada: {}", e.getMessage(), e);
        }
    }

    private void procesarPublicacionAprobada(String mensaje) {
        try {
            // Aquí se parsearía el JSON del evento
            String autorId = "autor-ejemplo-id";
            String autorEmail = "autor@ejemplo.com";
            String tituloPublicacion = "Título de la publicación";
            
            notificacionService.crearNotificacionPublicacionAprobada(
                autorId, autorEmail, tituloPublicacion);
                
        } catch (Exception e) {
            log.error("Error procesando publicación aprobada: {}", e.getMessage(), e);
        }
    }

    private void procesarRevisionSolicitada(String mensaje) {
        try {
            // Aquí se parsearía el JSON del evento
            String autorId = "autor-ejemplo-id";
            String autorEmail = "autor@ejemplo.com";
            String tituloPublicacion = "Título de la publicación";
            
            notificacionService.crearNotificacionCambiosSolicitados(
                autorId, autorEmail, tituloPublicacion);
                
        } catch (Exception e) {
            log.error("Error procesando revisión solicitada: {}", e.getMessage(), e);
        }
    }

    private void procesarUsuarioRegistrado(String mensaje) {
        try {
            // Aquí se parsearía el JSON del evento
            log.info("Usuario registrado - enviando notificación de bienvenida");
            
        } catch (Exception e) {
            log.error("Error procesando usuario registrado: {}", e.getMessage(), e);
        }
    }

    private void procesarUsuarioLogin(String mensaje) {
        try {
            // Aquí se parsearía el JSON del evento
            log.info("Usuario login - registrando actividad");
            
        } catch (Exception e) {
            log.error("Error procesando usuario login: {}", e.getMessage(), e);
        }
    }
}

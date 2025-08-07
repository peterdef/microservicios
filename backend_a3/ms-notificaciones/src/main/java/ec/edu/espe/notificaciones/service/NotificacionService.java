package ec.edu.espe.notificaciones.service;

import ec.edu.espe.notificaciones.entity.Notificacion;
import ec.edu.espe.notificaciones.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final EmailService emailService;
    private final WebSocketService webSocketService;
    private final PushNotificationService pushNotificationService;

    public Notificacion crearNotificacion(String titulo, String mensaje, String tipo, 
                                        String destinatarioId, String destinatarioEmail, 
                                        String canalEnvio, String prioridad) {
        
        Notificacion notificacion = new Notificacion();
        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setDestinatarioId(destinatarioId);
        notificacion.setDestinatarioEmail(destinatarioEmail);
        notificacion.setCanalEnvio(canalEnvio);
        notificacion.setPrioridad(prioridad);
        
        return notificacionRepository.save(notificacion);
    }

    public void enviarNotificacion(Notificacion notificacion) {
        try {
            switch (notificacion.getCanalEnvio().toUpperCase()) {
                case "EMAIL":
                    emailService.enviarEmail(notificacion);
                    break;
                case "WEBSOCKET":
                    webSocketService.enviarNotificacion(notificacion);
                    break;
                case "PUSH":
                    pushNotificationService.enviarPushNotification(notificacion);
                    break;
                case "SMS":
                    // Implementar servicio SMS
                    log.info("SMS enviado a: {}", notificacion.getDestinatarioId());
                    break;
                default:
                    log.warn("Canal de envío no soportado: {}", notificacion.getCanalEnvio());
            }
            
            notificacion.setEstadoEnvio("ENVIADO");
            notificacion.setFechaEnvio(LocalDateTime.now());
            notificacionRepository.save(notificacion);
            
        } catch (Exception e) {
            notificacion.setEstadoEnvio("ERROR");
            notificacion.setIntentosEnvio(notificacion.getIntentosEnvio() + 1);
            notificacion.setErrorMensaje(e.getMessage());
            notificacionRepository.save(notificacion);
            log.error("Error enviando notificación: {}", e.getMessage(), e);
        }
    }

    public List<Notificacion> obtenerNotificacionesPorUsuario(String userId) {
        return notificacionRepository.findByDestinatarioIdOrderByFechaCreacionDesc(userId);
    }

    public List<Notificacion> obtenerNotificacionesPendientes() {
        return notificacionRepository.findByEstadoEnvio("PENDIENTE");
    }

    public void reintentarNotificacionesFallidas() {
        List<Notificacion> notificacionesFallidas = notificacionRepository.findByEstadoEnvioAndIntentosEnvioLessThan("ERROR", 3);
        
        for (Notificacion notificacion : notificacionesFallidas) {
            enviarNotificacion(notificacion);
        }
    }

    public void crearNotificacionPublicacionAprobada(String autorId, String autorEmail, String tituloPublicacion) {
        String titulo = "Publicación Aprobada";
        String mensaje = String.format("Su publicación '%s' ha sido aprobada y está disponible en el catálogo.", tituloPublicacion);
        
        crearNotificacion(titulo, mensaje, "PUBLICACION_APROBADA", autorId, autorEmail, "EMAIL", "ALTA");
    }

    public void crearNotificacionCambiosSolicitados(String autorId, String autorEmail, String tituloPublicacion) {
        String titulo = "Cambios Solicitados";
        String mensaje = String.format("Se han solicitado cambios en su publicación '%s'. Por favor revise los comentarios.", tituloPublicacion);
        
        crearNotificacion(titulo, mensaje, "CAMBIOS_SOLICITADOS", autorId, autorEmail, "EMAIL", "ALTA");
    }

    public void crearNotificacionNuevaPublicacion(String lectorId, String lectorEmail, String tituloPublicacion, String autorNombre) {
        String titulo = "Nueva Publicación Disponible";
        String mensaje = String.format("Una nueva publicación está disponible: '%s' por %s", tituloPublicacion, autorNombre);
        
        crearNotificacion(titulo, mensaje, "NUEVA_PUBLICACION", lectorId, lectorEmail, "EMAIL", "NORMAL");
    }
}

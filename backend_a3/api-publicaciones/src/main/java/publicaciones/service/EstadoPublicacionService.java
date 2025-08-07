package publicaciones.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import publicaciones.event.PublicationApprovedEvent;
import publicaciones.event.PublicationPublishedEvent;
import publicaciones.event.PublicationSubmittedEvent;
import publicaciones.event.ReviewRequestedEvent;
import publicaciones.model.EstadoPublicacion;
import publicaciones.model.Publicacion;
import publicaciones.model.Revision;
import publicaciones.producer.NotificacionProducer;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EstadoPublicacionService {

    private final NotificacionProducer notificacionProducer;
    private final OutboxService outboxService;

    public boolean puedeTransicionar(EstadoPublicacion estadoActual, EstadoPublicacion nuevoEstado, String rolUsuario) {
        switch (estadoActual) {
            case BORRADOR:
                return nuevoEstado == EstadoPublicacion.EN_REVISION && "ROLE_AUTOR".equals(rolUsuario);
            
            case EN_REVISION:
                return (nuevoEstado == EstadoPublicacion.CAMBIOS_SOLICITADOS && "ROLE_REVISOR".equals(rolUsuario)) ||
                       (nuevoEstado == EstadoPublicacion.APROBADO && "ROLE_EDITOR".equals(rolUsuario)) ||
                       (nuevoEstado == EstadoPublicacion.RETIRADO && "ROLE_ADMIN".equals(rolUsuario));
            
            case CAMBIOS_SOLICITADOS:
                return nuevoEstado == EstadoPublicacion.EN_REVISION && "ROLE_AUTOR".equals(rolUsuario);
            
            case APROBADO:
                return nuevoEstado == EstadoPublicacion.PUBLICADO && "ROLE_EDITOR".equals(rolUsuario);
            
            case PUBLICADO:
                return nuevoEstado == EstadoPublicacion.RETIRADO && "ROLE_ADMIN".equals(rolUsuario);
            
            case RETIRADO:
                return false; // No se puede cambiar desde retirado
            
            default:
                return false;
        }
    }

    @Transactional
    public void cambiarEstado(Publicacion publicacion, EstadoPublicacion nuevoEstado, String rolUsuario, String comentario) {
        if (!puedeTransicionar(publicacion.getEstado(), nuevoEstado, rolUsuario)) {
            throw new IllegalStateException("No se puede cambiar de " + publicacion.getEstado() + " a " + nuevoEstado + " con rol " + rolUsuario);
        }

        EstadoPublicacion estadoAnterior = publicacion.getEstado();
        publicacion.setEstado(nuevoEstado);
        
        // Incrementar versión si es necesario
        if (nuevoEstado == EstadoPublicacion.EN_REVISION) {
            publicacion.setVersionActual(publicacion.getVersionActual() + 1);
        }

        // Enviar notificación según el cambio de estado
        enviarNotificacionCambioEstado(publicacion, estadoAnterior, nuevoEstado, comentario);
        
        // Guardar evento en outbox para garantizar entrega
        guardarEventoEnOutbox(publicacion, nuevoEstado, rolUsuario, comentario);
    }

    private void enviarNotificacionCambioEstado(Publicacion publicacion, EstadoPublicacion estadoAnterior, EstadoPublicacion nuevoEstado, String comentario) {
        String mensaje = String.format("Publicación '%s' cambió de estado: %s → %s", 
                publicacion.getTitulo(), 
                estadoAnterior.getDescripcion(), 
                nuevoEstado.getDescripcion());
        
        String tipo = "CAMBIO_ESTADO";
        
        if (comentario != null && !comentario.trim().isEmpty()) {
            mensaje += " - Comentario: " + comentario;
        }

        notificacionProducer.enviarNotificacion(mensaje, tipo);
    }

    public boolean puedeRevisar(UUID publicacionId, UUID revisorId, List<Revision> revisiones) {
        // Verificar que el revisor no haya revisado ya esta publicación
        return revisiones.stream()
                .noneMatch(revision -> revision.getRevisorId().equals(revisorId) && 
                        revision.getPublicacionId().equals(publicacionId));
    }

    public void asignarRevisor(Publicacion publicacion, UUID revisorId) {
        if (publicacion.getEstado() != EstadoPublicacion.EN_REVISION) {
            throw new IllegalStateException("Solo se pueden asignar revisores a publicaciones en revisión");
        }

        String mensaje = String.format("Revisor asignado a la publicación '%s'", publicacion.getTitulo());
        notificacionProducer.enviarNotificacion(mensaje, "ASIGNACION_REVISOR");
        
        // Guardar evento de asignación de revisor
        ReviewRequestedEvent event = new ReviewRequestedEvent();
        event.setPublicationId(publicacion.getId());
        event.setRevisorId(revisorId);
        event.setUserId("system");
        event.setUserRole("SYSTEM");
        
        outboxService.guardarEvento(
            publicacion.getId(),
            "Publication",
            "ReviewRequested",
            event
        );
    }

    private void guardarEventoEnOutbox(Publicacion publicacion, EstadoPublicacion nuevoEstado, String rolUsuario, String comentario) {
        switch (nuevoEstado) {
            case EN_REVISION:
                PublicationSubmittedEvent submittedEvent = new PublicationSubmittedEvent();
                submittedEvent.setPublicationId(publicacion.getId());
                submittedEvent.setUserId("system");
                submittedEvent.setUserRole(rolUsuario);
                
                outboxService.guardarEvento(
                    publicacion.getId(),
                    "Publication",
                    "PublicationSubmitted",
                    submittedEvent
                );
                break;
                
            case APROBADO:
                PublicationApprovedEvent approvedEvent = new PublicationApprovedEvent();
                approvedEvent.setPublicationId(publicacion.getId());
                approvedEvent.setApprovedBy(rolUsuario);
                approvedEvent.setApprovalComments(comentario);
                approvedEvent.setUserId("system");
                approvedEvent.setUserRole(rolUsuario);
                
                outboxService.guardarEvento(
                    publicacion.getId(),
                    "Publication",
                    "PublicationApproved",
                    approvedEvent
                );
                break;
                
            case PUBLICADO:
                PublicationPublishedEvent publishedEvent = new PublicationPublishedEvent();
                publishedEvent.setPublicationId(publicacion.getId());
                publishedEvent.setUserId("system");
                publishedEvent.setUserRole(rolUsuario);
                
                outboxService.guardarEvento(
                    publicacion.getId(),
                    "Publication",
                    "PublicationPublished",
                    publishedEvent
                );
                break;
        }
    }
}

package publicaciones.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import publicaciones.client.AuthClient;
import publicaciones.model.EstadoPublicacion;
import publicaciones.model.HistorialEstado;
import publicaciones.model.Publicacion;
import publicaciones.repository.HistorialEstadoRepository;
import publicaciones.repository.PublicacionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EstadoPublicacionService {

    private final PublicacionRepository publicacionRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final AuthClient authClient;

    @Transactional
    public void cambiarEstado(UUID publicacionId, EstadoPublicacion nuevoEstado, 
                            UUID usuarioId, String comentarios, String motivoCambio,
                            String ipOrigen, String userAgent) {
        
        Publicacion publicacion = publicacionRepository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        
        EstadoPublicacion estadoAnterior = publicacion.getEstado();
        
        // Validar transición de estado
        if (!esTransicionValida(estadoAnterior, nuevoEstado, usuarioId)) {
            throw new RuntimeException("Transición de estado no válida");
        }
        
        // Actualizar estado
        publicacion.setEstado(nuevoEstado);
        publicacion.setFechaActualizacion(LocalDateTime.now());
        publicacionRepository.save(publicacion);
        
        // Registrar en historial
        HistorialEstado historial = new HistorialEstado();
        historial.setPublicacionId(publicacionId);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setEstadoNuevo(nuevoEstado);
        historial.setUsuarioId(usuarioId);
        historial.setComentarios(comentarios);
        historial.setMotivoCambio(motivoCambio);
        historial.setIpOrigen(ipOrigen);
        historial.setUserAgent(userAgent);
        
        historialEstadoRepository.save(historial);
        
        log.info("Estado de publicación {} cambiado de {} a {} por usuario {}", 
                publicacionId, estadoAnterior, nuevoEstado, usuarioId);
    }

    private boolean esTransicionValida(EstadoPublicacion estadoActual, EstadoPublicacion nuevoEstado, UUID usuarioId) {
        // Obtener roles del usuario
        String[] roles = authClient.getUserRoles(usuarioId.toString(), "Bearer token");
        
        switch (estadoActual) {
            case BORRADOR:
                return nuevoEstado == EstadoPublicacion.EN_REVISION && 
                       tieneRol(roles, "ROLE_AUTOR");
                
            case EN_REVISION:
                return (nuevoEstado == EstadoPublicacion.CAMBIOS_SOLICITADOS && 
                        tieneRol(roles, "ROLE_REVISOR")) ||
                       (nuevoEstado == EstadoPublicacion.APROBADO && 
                        tieneRol(roles, "ROLE_EDITOR"));
                
            case CAMBIOS_SOLICITADOS:
                return nuevoEstado == EstadoPublicacion.EN_REVISION && 
                       tieneRol(roles, "ROLE_AUTOR");
                
            case APROBADO:
                return nuevoEstado == EstadoPublicacion.PUBLICADO && 
                       tieneRol(roles, "ROLE_EDITOR");
                
            case PUBLICADO:
                return nuevoEstado == EstadoPublicacion.RETIRADO && 
                       tieneRol(roles, "ROLE_ADMIN");
                
            default:
                return false;
        }
    }

    private boolean tieneRol(String[] roles, String rolRequerido) {
        for (String rol : roles) {
            if (rol.equals(rolRequerido)) {
                return true;
            }
        }
        return false;
    }

    public List<HistorialEstado> obtenerHistorialPublicacion(UUID publicacionId) {
        return historialEstadoRepository.findByPublicacionIdOrderByFechaCambioDesc(publicacionId);
    }

    public List<HistorialEstado> obtenerHistorialUsuario(UUID usuarioId) {
        return historialEstadoRepository.findByUsuarioIdOrderByFechaCambioDesc(usuarioId);
    }

    public List<HistorialEstado> obtenerHistorialPorEstado(EstadoPublicacion estado) {
        return historialEstadoRepository.findByEstadoNuevoOrderByFechaCambioDesc(estado);
    }

    public List<HistorialEstado> obtenerHistorialPorMotivo(String motivoCambio) {
        return historialEstadoRepository.findByMotivoCambioOrderByFechaCambioDesc(motivoCambio);
    }
}

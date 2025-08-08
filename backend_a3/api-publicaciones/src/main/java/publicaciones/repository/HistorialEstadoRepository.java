package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import publicaciones.model.HistorialEstado;

import java.util.List;
import java.util.UUID;

@Repository
public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, UUID> {
    
    List<HistorialEstado> findByPublicacionIdOrderByFechaCambioDesc(UUID publicacionId);
    
    List<HistorialEstado> findByUsuarioIdOrderByFechaCambioDesc(UUID usuarioId);
    
    List<HistorialEstado> findByEstadoNuevoOrderByFechaCambioDesc(publicaciones.model.EstadoPublicacion estado);
    
    List<HistorialEstado> findByMotivoCambioOrderByFechaCambioDesc(String motivoCambio);
}


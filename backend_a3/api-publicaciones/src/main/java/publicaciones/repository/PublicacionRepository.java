package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import publicaciones.model.Publicacion;
import publicaciones.model.EstadoPublicacion;

import java.util.List;
import java.util.UUID;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, UUID> {
    
    List<Publicacion> findByEstado(EstadoPublicacion estado);
    
    List<Publicacion> findByAutorPrincipalId(UUID autorPrincipalId);
    
    List<Publicacion> findByTituloContainingIgnoreCase(String titulo);
    
    List<Publicacion> findByEstadoAndAutorPrincipalId(EstadoPublicacion estado, UUID autorPrincipalId);
    
    boolean existsByTituloAndAutorPrincipalId(String titulo, UUID autorPrincipalId);
}

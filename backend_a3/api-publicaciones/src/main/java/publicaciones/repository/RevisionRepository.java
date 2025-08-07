package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import publicaciones.model.Revision;

import java.util.List;
import java.util.UUID;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, UUID> {
    
    List<Revision> findByPublicacionId(UUID publicacionId);
    
    List<Revision> findByRevisorId(UUID revisorId);
    
    List<Revision> findByPublicacionIdAndEstadoRevision(UUID publicacionId, Revision.EstadoRevision estadoRevision);
    
    List<Revision> findByRevisorIdAndEstadoRevision(UUID revisorId, Revision.EstadoRevision estadoRevision);
}

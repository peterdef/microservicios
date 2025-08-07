package publicaciones.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import publicaciones.dto.RevisionDto;
import publicaciones.model.Revision;
import publicaciones.repository.RevisionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RevisionService {

    private final RevisionRepository revisionRepository;

    public Revision crearRevision(RevisionDto dto) {
        Revision revision = new Revision();
        revision.setPublicacionId(dto.getPublicacionId());
        revision.setRevisorId(dto.getRevisorId());
        revision.setComentarios(dto.getComentarios());
        revision.setPuntuacionCalidad(dto.getPuntuacionCalidad());
        revision.setRecomendacion(dto.getRecomendacion());
        revision.setEstadoRevision(Revision.EstadoRevision.PENDIENTE);
        revision.setFechaAsignacion(LocalDateTime.now());
        
        return revisionRepository.save(revision);
    }

    public List<Revision> obtenerRevisionesPorPublicacion(UUID publicacionId) {
        return revisionRepository.findByPublicacionId(publicacionId);
    }

    public List<Revision> obtenerRevisionesPorRevisor(UUID revisorId) {
        return revisionRepository.findByRevisorId(revisorId);
    }

    public Revision completarRevision(UUID id, String recomendacion, String comentarios, Integer puntuacionCalidad) {
        Revision revision = revisionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Revisión no encontrada"));
        
        revision.setRecomendacion(recomendacion);
        revision.setComentarios(comentarios);
        revision.setPuntuacionCalidad(puntuacionCalidad);
        revision.setFechaRevision(LocalDateTime.now());
        revision.setEstadoRevision(Revision.EstadoRevision.ACEPTADA);
        
        return revisionRepository.save(revision);
    }

    public Revision obtenerRevision(UUID id) {
        return revisionRepository.findById(id).orElse(null);
    }

    public Revision asignarRevisor(UUID publicacionId, UUID revisorId) {
        // Verificar que no exista ya una revisión para esta publicación y revisor
        List<Revision> revisionesExistentes = revisionRepository.findByPublicacionId(publicacionId);
        boolean yaAsignado = revisionesExistentes.stream()
                .anyMatch(revision -> revision.getRevisorId().equals(revisorId));
        
        if (yaAsignado) {
            throw new RuntimeException("El revisor ya está asignado a esta publicación");
        }

        Revision revision = new Revision();
        revision.setPublicacionId(publicacionId);
        revision.setRevisorId(revisorId);
        revision.setEstadoRevision(Revision.EstadoRevision.PENDIENTE);
        revision.setFechaAsignacion(LocalDateTime.now());
        
        return revisionRepository.save(revision);
    }

    public List<Revision> obtenerRevisionesPendientes(UUID revisorId) {
        return revisionRepository.findByRevisorIdAndEstadoRevision(revisorId, Revision.EstadoRevision.PENDIENTE);
    }
}

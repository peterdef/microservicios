package publicaciones.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import publicaciones.dto.RevisionDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Revision;
import publicaciones.service.RevisionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/revisiones")
@RequiredArgsConstructor
public class RevisionController {

    private final RevisionService revisionService;

    @PostMapping
    @PreAuthorize("hasRole('REVISOR')")
    public ResponseEntity<ResponseDto> crearRevision(@Valid @RequestBody RevisionDto dto) {
        Revision revision = revisionService.crearRevision(dto);
        return ResponseEntity.ok(new ResponseDto(
                "Revisión creada exitosamente",
                revision
        ));
    }

    @GetMapping("/publicacion/{publicacionId}")
    @PreAuthorize("hasAnyRole('AUTOR', 'REVISOR', 'EDITOR', 'ADMIN')")
    public ResponseEntity<ResponseDto> obtenerRevisionesPorPublicacion(@PathVariable UUID publicacionId) {
        List<Revision> revisiones = revisionService.obtenerRevisionesPorPublicacion(publicacionId);
        return ResponseEntity.ok(new ResponseDto(
                "Revisiones obtenidas exitosamente",
                revisiones
        ));
    }

    @GetMapping("/revisor/{revisorId}")
    @PreAuthorize("hasRole('REVISOR')")
    public ResponseEntity<ResponseDto> obtenerRevisionesPorRevisor(@PathVariable UUID revisorId) {
        List<Revision> revisiones = revisionService.obtenerRevisionesPorRevisor(revisorId);
        return ResponseEntity.ok(new ResponseDto(
                "Revisiones del revisor obtenidas exitosamente",
                revisiones
        ));
    }

    @PutMapping("/{id}/completar")
    @PreAuthorize("hasRole('REVISOR')")
    public ResponseEntity<ResponseDto> completarRevision(
            @PathVariable UUID id,
            @RequestParam String recomendacion,
            @RequestParam(required = false) String comentarios,
            @RequestParam(required = false) Integer puntuacionCalidad) {
        
        Revision revision = revisionService.completarRevision(id, recomendacion, comentarios, puntuacionCalidad);
        return ResponseEntity.ok(new ResponseDto(
                "Revisión completada exitosamente",
                revision
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AUTOR', 'REVISOR', 'EDITOR', 'ADMIN')")
    public ResponseEntity<ResponseDto> obtenerRevision(@PathVariable UUID id) {
        Revision revision = revisionService.obtenerRevision(id);
        if (revision == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new ResponseDto(
                "Revisión obtenida exitosamente",
                revision
        ));
    }

    @PostMapping("/publicacion/{publicacionId}/asignar-revisor/{revisorId}")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<ResponseDto> asignarRevisor(
            @PathVariable UUID publicacionId,
            @PathVariable UUID revisorId) {
        
        Revision revision = revisionService.asignarRevisor(publicacionId, revisorId);
        return ResponseEntity.ok(new ResponseDto(
                "Revisor asignado exitosamente",
                revision
        ));
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('REVISOR')")
    public ResponseEntity<ResponseDto> obtenerRevisionesPendientes(@RequestParam UUID revisorId) {
        List<Revision> revisiones = revisionService.obtenerRevisionesPendientes(revisorId);
        return ResponseEntity.ok(new ResponseDto(
                "Revisiones pendientes obtenidas exitosamente",
                revisiones
        ));
    }
}

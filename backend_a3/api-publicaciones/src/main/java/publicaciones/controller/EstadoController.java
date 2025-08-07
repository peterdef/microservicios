package publicaciones.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import publicaciones.dto.CambioEstadoDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.EstadoPublicacion;
import publicaciones.model.Publicacion;
import publicaciones.service.EstadoPublicacionService;
import publicaciones.service.LibroService;
import publicaciones.service.PaperService;

import java.util.UUID;

@RestController
@RequestMapping("/estados")
@RequiredArgsConstructor
public class EstadoController {

    private final EstadoPublicacionService estadoService;
    private final LibroService libroService;
    private final PaperService paperService;

    @PostMapping("/publicaciones/{id}/cambiar-estado")
    @PreAuthorize("hasAnyRole('AUTOR', 'REVISOR', 'EDITOR', 'ADMIN')")
    public ResponseEntity<ResponseDto> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambioEstadoDto dto) {
        
        // Buscar la publicación (libro o paper)
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        estadoService.cambiarEstado(publicacion, dto.getNuevoEstado(), dto.getRolUsuario(), dto.getComentario());
        
        return ResponseEntity.ok(new ResponseDto(
                "Estado cambiado exitosamente",
                publicacion
        ));
    }

    @GetMapping("/publicaciones/{id}/estado-actual")
    public ResponseEntity<ResponseDto> obtenerEstadoActual(@PathVariable UUID id) {
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new ResponseDto(
                "Estado actual obtenido",
                publicacion.getEstado()
        ));
    }

    @GetMapping("/publicaciones/{id}/transiciones-posibles")
    @PreAuthorize("hasAnyRole('AUTOR', 'REVISOR', 'EDITOR', 'ADMIN')")
    public ResponseEntity<ResponseDto> obtenerTransicionesPosibles(
            @PathVariable UUID id,
            @RequestParam String rolUsuario) {
        
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        EstadoPublicacion[] estadosPosibles = EstadoPublicacion.values();
        EstadoPublicacion[] transicionesValidas = java.util.Arrays.stream(estadosPosibles)
                .filter(estado -> estadoService.puedeTransicionar(publicacion.getEstado(), estado, rolUsuario))
                .toArray(EstadoPublicacion[]::new);

        return ResponseEntity.ok(new ResponseDto(
                "Transiciones posibles obtenidas",
                transicionesValidas
        ));
    }

    @PostMapping("/publicaciones/{id}/enviar-revision")
    @PreAuthorize("hasRole('AUTOR')")
    public ResponseEntity<ResponseDto> enviarARevision(@PathVariable UUID id) {
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        estadoService.cambiarEstado(publicacion, EstadoPublicacion.EN_REVISION, "ROLE_AUTOR", "Enviado a revisión");
        
        return ResponseEntity.ok(new ResponseDto(
                "Publicación enviada a revisión exitosamente",
                publicacion
        ));
    }

    @PostMapping("/publicaciones/{id}/aprobar")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<ResponseDto> aprobarPublicacion(
            @PathVariable UUID id,
            @RequestParam(required = false) String comentario) {
        
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        estadoService.cambiarEstado(publicacion, EstadoPublicacion.APROBADO, "ROLE_EDITOR", comentario);
        
        return ResponseEntity.ok(new ResponseDto(
                "Publicación aprobada exitosamente",
                publicacion
        ));
    }

    @PostMapping("/publicaciones/{id}/publicar")
    @PreAuthorize("hasRole('EDITOR')")
    public ResponseEntity<ResponseDto> publicarPublicacion(
            @PathVariable UUID id,
            @RequestParam(required = false) String comentario) {
        
        Publicacion publicacion = libroService.buscarPorId(id);
        if (publicacion == null) {
            publicacion = paperService.buscarPorId(id);
        }
        
        if (publicacion == null) {
            return ResponseEntity.notFound().build();
        }

        estadoService.cambiarEstado(publicacion, EstadoPublicacion.PUBLICADO, "ROLE_EDITOR", comentario);
        
        return ResponseEntity.ok(new ResponseDto(
                "Publicación publicada exitosamente",
                publicacion
        ));
    }
}

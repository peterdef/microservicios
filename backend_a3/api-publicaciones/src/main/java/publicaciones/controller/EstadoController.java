package publicaciones.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import publicaciones.dto.CambioEstadoDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.EstadoPublicacion;
import publicaciones.model.HistorialEstado;
import publicaciones.service.EstadoPublicacionService;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/estados")
@RequiredArgsConstructor
@Slf4j
public class EstadoController {

    private final EstadoPublicacionService estadoPublicacionService;

    @PostMapping("/publicaciones/{id}/cambiar-estado")
    public ResponseEntity<ResponseDto> cambiarEstado(
            @PathVariable UUID id,
            @RequestBody CambioEstadoDto cambioEstadoDto,
            HttpServletRequest request) {
        
        try {
            String ipOrigen = obtenerIpOrigen(request);
            String userAgent = request.getHeader("User-Agent");
            
            estadoPublicacionService.cambiarEstado(
                id,
                cambioEstadoDto.getNuevoEstado(),
                cambioEstadoDto.getUsuarioId(),
                cambioEstadoDto.getComentarios(),
                cambioEstadoDto.getMotivoCambio(),
                ipOrigen,
                userAgent
            );
            
            return ResponseEntity.ok(ResponseDto.builder()
                    .success(true)
                    .message("Estado cambiado exitosamente")
                    .build());
                    
        } catch (Exception e) {
            log.error("Error cambiando estado: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ResponseDto.builder()
                    .success(false)
                    .message("Error cambiando estado: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/publicaciones/{id}/historial")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialPublicacion(@PathVariable UUID id) {
        try {
            List<HistorialEstado> historial = estadoPublicacionService.obtenerHistorialPublicacion(id);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            log.error("Error obteniendo historial: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/usuarios/{usuarioId}/historial")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialUsuario(@PathVariable UUID usuarioId) {
        try {
            List<HistorialEstado> historial = estadoPublicacionService.obtenerHistorialUsuario(usuarioId);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            log.error("Error obteniendo historial de usuario: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estado/{estado}/historial")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialPorEstado(@PathVariable EstadoPublicacion estado) {
        try {
            List<HistorialEstado> historial = estadoPublicacionService.obtenerHistorialPorEstado(estado);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            log.error("Error obteniendo historial por estado: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/motivo/{motivo}/historial")
    public ResponseEntity<List<HistorialEstado>> obtenerHistorialPorMotivo(@PathVariable String motivo) {
        try {
            List<HistorialEstado> historial = estadoPublicacionService.obtenerHistorialPorMotivo(motivo);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            log.error("Error obteniendo historial por motivo: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    private String obtenerIpOrigen(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

package publicaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import publicaciones.model.EstadoPublicacion;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CambioEstadoDto {
    
    private EstadoPublicacion nuevoEstado;
    private UUID usuarioId;
    private String comentarios;
    private String motivoCambio; // APROBACION, REVISION, CAMBIOS_SOLICITADOS, PUBLICACION
    private String metadata; // JSON con datos adicionales
}

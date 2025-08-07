package publicaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import publicaciones.model.EstadoPublicacion;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CambioEstadoDto {
    private EstadoPublicacion nuevoEstado;
    private String comentario;
    private String rolUsuario;
}

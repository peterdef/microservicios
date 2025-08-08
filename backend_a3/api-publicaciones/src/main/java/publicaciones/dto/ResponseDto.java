package publicaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDto {
    private String mensaje;
    private Object dato;
    private String message;
    private Boolean success;
    
    public ResponseDto(String mensaje, Object dato) {
        this.mensaje = mensaje;
        this.dato = dato;
    }
}

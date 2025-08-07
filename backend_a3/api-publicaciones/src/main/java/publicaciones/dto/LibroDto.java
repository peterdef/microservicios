package publicaciones.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import publicaciones.model.TipoPublicacion;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibroDto {

    @NotBlank(message = "El título es campo obligatorio")
    private String titulo;

    @NotBlank(message = "El resumen es campo obligatorio")
    private String resumen;

    private List<String> palabrasClave;

    @NotBlank(message = "El ISBN es campo obligatorio")
    private String isbn;

    @Positive(message = "El número de páginas debe ser positivo")
    private Integer numeroPaginas;

    private String edicion;

    private List<CapituloDto> capitulos;

    @NotNull(message = "Se requiere el ID del autor")
    private UUID autorPrincipalId;

    private List<UUID> coAutoresIds;

    private String metadatos; // JSON string

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CapituloDto {
        private Integer numero;
        private String titulo;
        private String resumen;
    }
}

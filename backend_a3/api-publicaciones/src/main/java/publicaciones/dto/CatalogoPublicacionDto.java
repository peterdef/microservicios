package publicaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogoPublicacionDto {
    
    private UUID publicacionOriginalId;
    private String titulo;
    private String resumen;
    private List<String> palabrasClave;
    private UUID autorPrincipalId;
    private String autorPrincipalNombre;
    private List<UUID> coAutoresIds;
    private String tipoPublicacion; // ARTICULO o LIBRO
    
    // Campos específicos de Libro
    private String isbn;
    private Integer numeroPaginas;
    private String edicion;
    
    // Campos específicos de Artículo
    private String doi;
    private String revistaObjetivo;
    private String seccion;
    private Integer numeroFiguras;
    
    // Metadatos generales
    private String metadatos; // JSON string
    private String categoria;
    private String licencia;
    
    // Campos de publicación
    private LocalDateTime fechaPublicacion;
    private String urlPublicacion;
}

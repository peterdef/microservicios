package publicaciones.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import publicaciones.model.Revision;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RevisionDto {
    private UUID publicacionId;
    private UUID revisorId;
    private String comentarios;
    private Integer puntuacionCalidad;
    private String recomendacion; // ACEPTAR, SOLICITAR_CAMBIOS, RECHAZAR
}

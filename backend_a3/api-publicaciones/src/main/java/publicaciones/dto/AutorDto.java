package publicaciones.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutorDto {

    @NotBlank(message = "Los nombres del autor son obligatorios")
    private String nombres;

    @NotBlank(message = "Los apellidos del autor son obligatorios")
    private String apellidos;

    @Email(message = "Debe ser un correo válido")
    @NotBlank(message = "El correo es obligatorio")
    private String email;

    private String afiliacion;

    private String orcid;

    private String biografia;

    private String fotoUrl;

    private List<String> roles;
}

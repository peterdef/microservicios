package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity(name = "autores")
@Setter
@Getter
public class Autor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "afiliacion")
    private String afiliacion;

    @Column(unique = true)
    private String orcid;

    @Column(columnDefinition = "TEXT")
    private String biografia;

    @Column(name = "foto_url")
    private String fotoUrl;

    @ElementCollection
    @CollectionTable(name = "autor_roles", joinColumns = @JoinColumn(name = "autor_id"))
    @Column(name = "rol")
    private List<String> roles;

    @OneToMany(mappedBy = "autor")
    @JsonIgnore
    private List<Libro> libros;

    @OneToMany(mappedBy = "autor")
    @JsonIgnore
    private List<Paper> articulos;
}

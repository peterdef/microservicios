package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity(name = "publicaciones")
@Setter
@Getter
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_publicacion", discriminatorType = DiscriminatorType.STRING)
public abstract class Publicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String resumen;

    @ElementCollection
    @CollectionTable(name = "publicacion_palabras_clave", joinColumns = @JoinColumn(name = "publicacion_id"))
    @Column(name = "palabra_clave")
    private List<String> palabrasClave;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPublicacion estado = EstadoPublicacion.BORRADOR;

    @Column(name = "version_actual")
    private Integer versionActual = 1;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "autor_principal_id", nullable = false)
    private UUID autorPrincipalId;

    @ElementCollection
    @CollectionTable(name = "publicacion_co_autores", joinColumns = @JoinColumn(name = "publicacion_id"))
    @Column(name = "co_autor_id")
    private List<UUID> coAutoresIds;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPublicacion tipo;

    @Column(columnDefinition = "TEXT")
    private String metadatos; // JSON con isbn, doi, paginas, categoria, licencia, etc.

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}

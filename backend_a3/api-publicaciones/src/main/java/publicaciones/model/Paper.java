package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "articulos")
@DiscriminatorValue("ARTICULO")
@Setter
@Getter
public class Paper extends Publicacion {

    @Column(name = "revista_objetivo")
    private String revistaObjetivo;
    
    private String seccion;
    
    @ElementCollection
    @CollectionTable(name = "articulo_referencias", joinColumns = @JoinColumn(name = "articulo_id"))
    @Column(name = "referencia", columnDefinition = "TEXT")
    private List<String> referenciasBibliograficas;
    
    @Column(name = "numero_figuras")
    private Integer numeroFiguras;
    
    @Column(name = "tabla_figuras_metadata")
    private String tablaFigurasMetadata;

    @Column(unique = true)
    private String doi;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    @JsonIgnore
    private Autor autor;
}

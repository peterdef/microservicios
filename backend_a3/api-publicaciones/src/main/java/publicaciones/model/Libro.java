package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "libros")
@Setter
@Getter
public class Libro extends Publicacion {
    
    private String isbn;
    
    @Column(name = "numero_paginas")
    private Integer numeroPaginas;
    
    private String edicion;
    
    @ElementCollection
    @CollectionTable(name = "libro_capitulos", joinColumns = @JoinColumn(name = "libro_id"))
    @AttributeOverrides({
        @AttributeOverride(name = "numero", column = @Column(name = "numero_capitulo")),
        @AttributeOverride(name = "titulo", column = @Column(name = "titulo_capitulo")),
        @AttributeOverride(name = "resumen", column = @Column(name = "resumen_capitulo", columnDefinition = "TEXT"))
    })
    private List<Capitulo> capitulos;

    @ManyToOne
    @JoinColumn(name = "autor_id")
    @JsonIgnore
    private Autor autor;

    @Embeddable
    @Getter
    @Setter
    public static class Capitulo {
        private Integer numero;
        private String titulo;
        private String resumen;
    }
}

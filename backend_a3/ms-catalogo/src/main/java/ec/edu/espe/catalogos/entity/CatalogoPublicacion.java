package ec.edu.espe.catalogos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity(name = "catalogo_publicaciones")
@Table(name = "catalogo_publicaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogoPublicacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "publicacion_original_id", nullable = false, unique = true)
    private UUID publicacionOriginalId;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String resumen;
    
    @ElementCollection
    @CollectionTable(name = "catalogo_palabras_clave", joinColumns = @JoinColumn(name = "catalogo_id"))
    @Column(name = "palabra_clave")
    private List<String> palabrasClave;
    
    @Column(name = "autor_principal_id", nullable = false)
    private UUID autorPrincipalId;
    
    @Column(name = "autor_principal_nombre")
    private String autorPrincipalNombre;
    
    @ElementCollection
    @CollectionTable(name = "catalogo_co_autores", joinColumns = @JoinColumn(name = "catalogo_id"))
    @Column(name = "co_autor_id")
    private List<UUID> coAutoresIds;
    
    @Column(name = "tipo_publicacion", nullable = false)
    private String tipoPublicacion; // ARTICULO o LIBRO
    
    @Column(name = "isbn")
    private String isbn;
    
    @Column(name = "doi")
    private String doi;
    
    @Column(name = "numero_paginas")
    private Integer numeroPaginas;
    
    @Column(name = "edicion")
    private String edicion;
    
    @Column(name = "revista_objetivo")
    private String revistaObjetivo;
    
    @Column(name = "seccion")
    private String seccion;
    
    @Column(name = "numero_figuras")
    private Integer numeroFiguras;
    
    @Column(name = "metadatos", columnDefinition = "JSONB")
    private String metadatos; // JSON con datos adicionales
    
    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDateTime fechaPublicacion;
    
    @Column(name = "fecha_indexacion", nullable = false)
    private LocalDateTime fechaIndexacion = LocalDateTime.now();
    
    @Column(name = "url_publicacion")
    private String urlPublicacion;
    
    @Column(name = "estado_indexacion", nullable = false)
    private String estadoIndexacion = "ACTIVO"; // ACTIVO, INACTIVO, RETIRADO
    
    // Campos para búsqueda y filtrado
    @Column(name = "texto_completo", columnDefinition = "TEXT")
    private String textoCompleto; // Para búsquedas full-text
    
    @Column(name = "categoria")
    private String categoria;
    
    @Column(name = "licencia")
    private String licencia;
}

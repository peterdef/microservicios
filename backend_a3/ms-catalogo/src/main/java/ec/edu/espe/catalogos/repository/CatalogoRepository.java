package ec.edu.espe.catalogos.repository;

import ec.edu.espe.catalogos.entity.CatalogoPublicacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CatalogoRepository extends JpaRepository<CatalogoPublicacion, UUID> {
    
    // Búsqueda por texto completo (título, resumen, palabras clave)
    @Query("SELECT c FROM catalogo_publicaciones c WHERE " +
           "LOWER(c.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(c.resumen) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "EXISTS (SELECT 1 FROM c.palabrasClave pc WHERE LOWER(pc) LIKE LOWER(CONCAT('%', :texto, '%')))")
    Page<CatalogoPublicacion> buscarPorTexto(@Param("texto") String texto, Pageable pageable);
    
    // Búsqueda por tipo de publicación
    Page<CatalogoPublicacion> findByTipoPublicacion(String tipoPublicacion, Pageable pageable);
    
    // Búsqueda por autor principal
    Page<CatalogoPublicacion> findByAutorPrincipalId(UUID autorPrincipalId, Pageable pageable);
    
    // Búsqueda por autor principal (nombre)
    @Query("SELECT c FROM catalogo_publicaciones c WHERE LOWER(c.autorPrincipalNombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    Page<CatalogoPublicacion> buscarPorAutorPrincipal(@Param("nombre") String nombre, Pageable pageable);
    
    // Búsqueda por ISBN
    Optional<CatalogoPublicacion> findByIsbn(String isbn);
    
    // Búsqueda por DOI
    Optional<CatalogoPublicacion> findByDoi(String doi);
    
    // Búsqueda por categoría
    Page<CatalogoPublicacion> findByCategoria(String categoria, Pageable pageable);
    
    // Búsqueda por palabras clave
    @Query("SELECT c FROM catalogo_publicaciones c WHERE EXISTS (SELECT 1 FROM c.palabrasClave pc WHERE pc IN :palabrasClave)")
    Page<CatalogoPublicacion> buscarPorPalabrasClave(@Param("palabrasClave") List<String> palabrasClave, Pageable pageable);
    
    // Búsqueda por rango de fechas
    @Query("SELECT c FROM catalogo_publicaciones c WHERE c.fechaPublicacion BETWEEN :fechaInicio AND :fechaFin")
    Page<CatalogoPublicacion> buscarPorRangoFechas(
            @Param("fechaInicio") java.time.LocalDateTime fechaInicio,
            @Param("fechaFin") java.time.LocalDateTime fechaFin,
            Pageable pageable);
    
    // Búsqueda por estado de indexación
    Page<CatalogoPublicacion> findByEstadoIndexacion(String estadoIndexacion, Pageable pageable);
    
    // Búsqueda por publicación original ID
    Optional<CatalogoPublicacion> findByPublicacionOriginalId(UUID publicacionOriginalId);
    
    // Búsqueda combinada avanzada
    @Query("SELECT c FROM catalogo_publicaciones c WHERE " +
           "(:tipo IS NULL OR c.tipoPublicacion = :tipo) AND " +
           "(:categoria IS NULL OR c.categoria = :categoria) AND " +
           "(:estado IS NULL OR c.estadoIndexacion = :estado) AND " +
           "(:texto IS NULL OR (LOWER(c.titulo) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(c.resumen) LIKE LOWER(CONCAT('%', :texto, '%'))))")
    Page<CatalogoPublicacion> buscarAvanzada(
            @Param("tipo") String tipo,
            @Param("categoria") String categoria,
            @Param("estado") String estado,
            @Param("texto") String texto,
            Pageable pageable);
    
    // Contar publicaciones por tipo
    @Query("SELECT c.tipoPublicacion, COUNT(c) FROM catalogo_publicaciones c GROUP BY c.tipoPublicacion")
    List<Object[]> contarPorTipo();
    
    // Contar publicaciones por categoría
    @Query("SELECT c.categoria, COUNT(c) FROM catalogo_publicaciones c WHERE c.categoria IS NOT NULL GROUP BY c.categoria")
    List<Object[]> contarPorCategoria();
}

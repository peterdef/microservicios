package ec.edu.espe.catalogos.controller;

import ec.edu.espe.catalogos.entity.CatalogoPublicacion;
import ec.edu.espe.catalogos.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/catalogo")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*") // Para acceso público
public class CatalogoController {

    private final CatalogoService catalogoService;

    // Endpoint público para listar todas las publicaciones
    @GetMapping("/publicaciones")
    public ResponseEntity<Page<CatalogoPublicacion>> listarPublicaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> publicaciones = catalogoService.listarTodas(pageable);
        
        return ResponseEntity.ok(publicaciones);
    }

    // Búsqueda por texto
    @GetMapping("/buscar")
    public ResponseEntity<Page<CatalogoPublicacion>> buscarPorTexto(
            @RequestParam String texto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> resultados = catalogoService.buscarPorTexto(texto, pageable);
        
        return ResponseEntity.ok(resultados);
    }

    // Búsqueda por tipo de publicación
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<Page<CatalogoPublicacion>> buscarPorTipo(
            @PathVariable String tipo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> resultados = catalogoService.buscarPorTipo(tipo, pageable);
        
        return ResponseEntity.ok(resultados);
    }

    // Búsqueda por autor
    @GetMapping("/autor")
    public ResponseEntity<Page<CatalogoPublicacion>> buscarPorAutor(
            @RequestParam String nombre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> resultados = catalogoService.buscarPorAutor(nombre, pageable);
        
        return ResponseEntity.ok(resultados);
    }

    // Búsqueda por categoría
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<Page<CatalogoPublicacion>> buscarPorCategoria(
            @PathVariable String categoria,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> resultados = catalogoService.buscarPorCategoria(categoria, pageable);
        
        return ResponseEntity.ok(resultados);
    }

    // Búsqueda por ISBN
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<CatalogoPublicacion> buscarPorIsbn(@PathVariable String isbn) {
        Optional<CatalogoPublicacion> publicacion = catalogoService.buscarPorIsbn(isbn);
        
        return publicacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Búsqueda por DOI
    @GetMapping("/doi/{doi}")
    public ResponseEntity<CatalogoPublicacion> buscarPorDoi(@PathVariable String doi) {
        Optional<CatalogoPublicacion> publicacion = catalogoService.buscarPorDoi(doi);
        
        return publicacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Búsqueda por ID del catálogo
    @GetMapping("/{id}")
    public ResponseEntity<CatalogoPublicacion> buscarPorId(@PathVariable UUID id) {
        Optional<CatalogoPublicacion> publicacion = catalogoService.buscarPorId(id);
        
        return publicacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Búsqueda avanzada
    @GetMapping("/buscar-avanzada")
    public ResponseEntity<Page<CatalogoPublicacion>> buscarAvanzada(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String texto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<CatalogoPublicacion> resultados = catalogoService.buscarAvanzada(tipo, categoria, estado, texto, pageable);
        
        return ResponseEntity.ok(resultados);
    }

    // Estadísticas por tipo
    @GetMapping("/estadisticas/tipo")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasPorTipo() {
        List<Object[]> estadisticas = catalogoService.obtenerEstadisticasPorTipo();
        return ResponseEntity.ok(estadisticas);
    }

    // Estadísticas por categoría
    @GetMapping("/estadisticas/categoria")
    public ResponseEntity<List<Object[]>> obtenerEstadisticasPorCategoria() {
        List<Object[]> estadisticas = catalogoService.obtenerEstadisticasPorCategoria();
        return ResponseEntity.ok(estadisticas);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Catálogo Service funcionando correctamente");
    }
}

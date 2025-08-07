package ec.edu.espe.catalogos.service;

import ec.edu.espe.catalogos.dto.PublicacionCatalogoDto;
import ec.edu.espe.catalogos.entity.CatalogoPublicacion;
import ec.edu.espe.catalogos.repository.CatalogoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogoService {

    private final CatalogoRepository catalogoRepository;

    @Transactional
    public CatalogoPublicacion indexarPublicacion(PublicacionCatalogoDto dto) {
        log.info("Indexando publicación en catálogo: {}", dto.getTitulo());
        
        // Verificar si ya existe
        Optional<CatalogoPublicacion> existente = catalogoRepository.findByPublicacionOriginalId(dto.getPublicacionOriginalId());
        
        CatalogoPublicacion catalogoPublicacion;
        if (existente.isPresent()) {
            // Actualizar existente
            catalogoPublicacion = existente.get();
            log.info("Actualizando publicación existente en catálogo: {}", dto.getTitulo());
        } else {
            // Crear nuevo
            catalogoPublicacion = new CatalogoPublicacion();
            catalogoPublicacion.setPublicacionOriginalId(dto.getPublicacionOriginalId());
            catalogoPublicacion.setFechaIndexacion(LocalDateTime.now());
            log.info("Creando nueva entrada en catálogo: {}", dto.getTitulo());
        }
        
        // Mapear datos
        catalogoPublicacion.setTitulo(dto.getTitulo());
        catalogoPublicacion.setResumen(dto.getResumen());
        catalogoPublicacion.setPalabrasClave(dto.getPalabrasClave());
        catalogoPublicacion.setAutorPrincipalId(dto.getAutorPrincipalId());
        catalogoPublicacion.setAutorPrincipalNombre(dto.getAutorPrincipalNombre());
        catalogoPublicacion.setCoAutoresIds(dto.getCoAutoresIds());
        catalogoPublicacion.setTipoPublicacion(dto.getTipoPublicacion());
        catalogoPublicacion.setMetadatos(dto.getMetadatos());
        catalogoPublicacion.setCategoria(dto.getCategoria());
        catalogoPublicacion.setLicencia(dto.getLicencia());
        catalogoPublicacion.setFechaPublicacion(dto.getFechaPublicacion());
        catalogoPublicacion.setUrlPublicacion(dto.getUrlPublicacion());
        catalogoPublicacion.setEstadoIndexacion("ACTIVO");
        
        // Campos específicos según tipo
        if ("LIBRO".equals(dto.getTipoPublicacion())) {
            catalogoPublicacion.setIsbn(dto.getIsbn());
            catalogoPublicacion.setNumeroPaginas(dto.getNumeroPaginas());
            catalogoPublicacion.setEdicion(dto.getEdicion());
        } else if ("ARTICULO".equals(dto.getTipoPublicacion())) {
            catalogoPublicacion.setDoi(dto.getDoi());
            catalogoPublicacion.setRevistaObjetivo(dto.getRevistaObjetivo());
            catalogoPublicacion.setSeccion(dto.getSeccion());
            catalogoPublicacion.setNumeroFiguras(dto.getNumeroFiguras());
        }
        
        // Generar texto completo para búsquedas
        String textoCompleto = generarTextoCompleto(dto);
        catalogoPublicacion.setTextoCompleto(textoCompleto);
        
        CatalogoPublicacion saved = catalogoRepository.save(catalogoPublicacion);
        log.info("Publicación indexada exitosamente: {} - ID: {}", dto.getTitulo(), saved.getId());
        
        return saved;
    }

    private String generarTextoCompleto(PublicacionCatalogoDto dto) {
        StringBuilder texto = new StringBuilder();
        texto.append(dto.getTitulo()).append(" ");
        texto.append(dto.getResumen()).append(" ");
        if (dto.getPalabrasClave() != null) {
            texto.append(String.join(" ", dto.getPalabrasClave())).append(" ");
        }
        texto.append(dto.getAutorPrincipalNombre()).append(" ");
        if (dto.getCategoria() != null) {
            texto.append(dto.getCategoria()).append(" ");
        }
        return texto.toString().toLowerCase();
    }

    @Transactional
    public void desindexarPublicacion(UUID publicacionOriginalId) {
        log.info("Desindexando publicación: {}", publicacionOriginalId);
        Optional<CatalogoPublicacion> catalogo = catalogoRepository.findByPublicacionOriginalId(publicacionOriginalId);
        if (catalogo.isPresent()) {
            CatalogoPublicacion publicacion = catalogo.get();
            publicacion.setEstadoIndexacion("INACTIVO");
            catalogoRepository.save(publicacion);
            log.info("Publicación desindexada: {}", publicacionOriginalId);
        } else {
            log.warn("Publicación no encontrada para desindexar: {}", publicacionOriginalId);
        }
    }

    // Métodos de búsqueda pública
    public Page<CatalogoPublicacion> buscarPorTexto(String texto, Pageable pageable) {
        return catalogoRepository.buscarPorTexto(texto, pageable);
    }

    public Page<CatalogoPublicacion> buscarPorTipo(String tipo, Pageable pageable) {
        return catalogoRepository.findByTipoPublicacion(tipo, pageable);
    }

    public Page<CatalogoPublicacion> buscarPorAutor(String nombre, Pageable pageable) {
        return catalogoRepository.buscarPorAutorPrincipal(nombre, pageable);
    }

    public Page<CatalogoPublicacion> buscarPorCategoria(String categoria, Pageable pageable) {
        return catalogoRepository.findByCategoria(categoria, pageable);
    }

    public Page<CatalogoPublicacion> buscarPorPalabrasClave(List<String> palabrasClave, Pageable pageable) {
        return catalogoRepository.buscarPorPalabrasClave(palabrasClave, pageable);
    }

    public Page<CatalogoPublicacion> buscarAvanzada(String tipo, String categoria, String estado, String texto, Pageable pageable) {
        return catalogoRepository.buscarAvanzada(tipo, categoria, estado, texto, pageable);
    }

    public Optional<CatalogoPublicacion> buscarPorIsbn(String isbn) {
        return catalogoRepository.findByIsbn(isbn);
    }

    public Optional<CatalogoPublicacion> buscarPorDoi(String doi) {
        return catalogoRepository.findByDoi(doi);
    }

    public Page<CatalogoPublicacion> listarTodas(Pageable pageable) {
        return catalogoRepository.findByEstadoIndexacion("ACTIVO", pageable);
    }

    public Optional<CatalogoPublicacion> buscarPorId(UUID id) {
        return catalogoRepository.findById(id);
    }

    // Métodos de estadísticas
    public List<Object[]> obtenerEstadisticasPorTipo() {
        return catalogoRepository.contarPorTipo();
    }

    public List<Object[]> obtenerEstadisticasPorCategoria() {
        return catalogoRepository.contarPorCategoria();
    }
}

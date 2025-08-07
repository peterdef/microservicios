package publicaciones.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import publicaciones.dto.LibroDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Autor;
import publicaciones.model.Libro;
import publicaciones.model.TipoPublicacion;
import publicaciones.producer.NotificacionProducer;
import publicaciones.repository.AutorRepository;
import publicaciones.repository.LibroRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LibroService {

    private final LibroRepository libroRepository;
    private final AutorRepository autorRepository;
    private final NotificacionProducer notificacionProducer;

    public ResponseDto crearLibro(LibroDto dto) {
        Autor autor = autorRepository.findById(dto.getAutorPrincipalId())
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + dto.getAutorPrincipalId()));
        
        Libro libro = new Libro();
        libro.setAutor(autor);
        libro.setTitulo(dto.getTitulo());
        libro.setResumen(dto.getResumen());
        libro.setPalabrasClave(dto.getPalabrasClave());
        libro.setIsbn(dto.getIsbn());
        libro.setNumeroPaginas(dto.getNumeroPaginas());
        libro.setEdicion(dto.getEdicion());
        libro.setAutorPrincipalId(dto.getAutorPrincipalId());
        libro.setCoAutoresIds(dto.getCoAutoresIds());
        libro.setTipo(TipoPublicacion.LIBRO);
        libro.setMetadatos(dto.getMetadatos());

        // Convertir capítulos DTO a entidad
        if (dto.getCapitulos() != null) {
            List<Libro.Capitulo> capitulos = dto.getCapitulos().stream()
                    .map(capDto -> {
                        Libro.Capitulo capitulo = new Libro.Capitulo();
                        capitulo.setNumero(capDto.getNumero());
                        capitulo.setTitulo(capDto.getTitulo());
                        capitulo.setResumen(capDto.getResumen());
                        return capitulo;
                    })
                    .toList();
            libro.setCapitulos(capitulos);
        }

        Libro savedLibro = libroRepository.save(libro);

        notificacionProducer.enviarNotificacion(
                "Libro: " + dto.getTitulo() + " registrado",
                "Nuevo Libro"
        );

        return new ResponseDto(
                "Libro registrado exitosamente",
                savedLibro);
    }

    public List<Libro> listarLibros() {
        return libroRepository.findAll();
    }

    public Libro buscarPorId(UUID id) {
        return libroRepository.findById(id).orElse(null);
    }
}

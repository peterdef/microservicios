package publicaciones.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Autor;
import publicaciones.model.Paper;
import publicaciones.model.TipoPublicacion;
import publicaciones.producer.NotificacionProducer;
import publicaciones.repository.AutorRepository;
import publicaciones.repository.PaperRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaperService {

    private final PaperRepository paperRepository;
    private final AutorRepository autorRepository;
    private final NotificacionProducer notificacionProducer;

    public ResponseDto crearPaper(Paper paper) {
        Autor autor = autorRepository.findById(paper.getAutorPrincipalId())
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + paper.getAutorPrincipalId()));
        
        paper.setAutor(autor);
        paper.setTipo(TipoPublicacion.ARTICULO);

        Paper savedPaper = paperRepository.save(paper);

        notificacionProducer.enviarNotificacion(
                "Artículo: " + paper.getTitulo() + " registrado",
                "Nuevo Artículo"
        );

        return new ResponseDto(
                "Artículo registrado exitosamente",
                savedPaper);
    }

    public List<Paper> listarPapers() {
        return paperRepository.findAll();
    }

    public Paper buscarPorId(UUID id) {
        return paperRepository.findById(id).orElse(null);
    }
}

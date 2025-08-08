package publicaciones.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import publicaciones.dto.AutorDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Autor;
import publicaciones.producer.NotificacionProducer;
import publicaciones.repository.AutorRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository autorRepository;
    private final NotificacionProducer notificacionProducer;

    //create
    public ResponseDto crearAutor(AutorDto dto) {
        Autor autor = new Autor();
        autor.setNombres(dto.getNombres());
        autor.setApellidos(dto.getApellidos());
        autor.setEmail(dto.getEmail());
        autor.setAfiliacion(dto.getAfiliacion());
        autor.setOrcid(dto.getOrcid());
        autor.setBiografia(dto.getBiografia());
        autor.setFotoUrl(dto.getFotoUrl());
        autor.setRoles(dto.getRoles());

        notificacionProducer.enviarNotificacion(
                "Nuevo autor registrado: " + dto.getNombres(),
                "nuevo autor"
        );

        return new ResponseDto(
                "Autor registrado exitosamente",
                autorRepository.save(autor));
    }

    public List<ResponseDto> listarAutores() {
        return autorRepository.findAll().stream()
                .map(autor -> new ResponseDto("Autor: " + autor.getApellidos(), autor))
                .collect(Collectors.toList());
    }

    public List<Autor> autores() {
        return autorRepository.findAll();
    }

    public ResponseDto autorPorId(UUID id) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + id));
        return new ResponseDto("Autor con id " + autor.getId(), autor);
    }

    public ResponseDto actualizarAutor(UUID id, AutorDto dto) {
        Autor autor = autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el autor con id: " + id));

        autor.setNombres(dto.getNombres());
        autor.setApellidos(dto.getApellidos());
        autor.setEmail(dto.getEmail());
        autor.setAfiliacion(dto.getAfiliacion());
        autor.setOrcid(dto.getOrcid());
        autor.setBiografia(dto.getBiografia());
        autor.setFotoUrl(dto.getFotoUrl());
        autor.setRoles(dto.getRoles());

        return new ResponseDto(
                "Autor actualizado exitosamente",
                autorRepository.save(autor));
    }


}

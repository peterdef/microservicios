package publicaciones.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import publicaciones.dto.LibroDto;
import publicaciones.dto.ResponseDto;
import publicaciones.model.Libro;
import publicaciones.service.LibroService;

import java.util.List;

@RestController
@RequestMapping("/libros")
public class LibroController {

    @Autowired
    private LibroService libroService;

    @PostMapping
    public ResponseDto createLibro(@RequestBody @Valid LibroDto dto) {
        return libroService.crearLibro(dto);
    }

    @GetMapping
    public List<Libro> listarLibros() {
        return libroService.listarLibros();
    }

}

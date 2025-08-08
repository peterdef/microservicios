package publicaciones.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import publicaciones.model.Autor;
import publicaciones.model.Libro;
import publicaciones.model.Paper;
import publicaciones.repository.AutorRepository;
import publicaciones.repository.LibroRepository;
import publicaciones.repository.PaperRepository;
import publicaciones.model.TipoPublicacion;

import java.util.List;

@Component
public class DataLoad implements CommandLineRunner {

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private LibroRepository libroRepository;

    @Autowired
    private PaperRepository paperRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (autorRepository.count() == 0) {
            Autor autor1 = new Autor();
            autor1.setNombres("Alex");
            autor1.setApellidos("Garcia");
            autor1.setEmail("alex@gmail.com");
            autor1.setAfiliacion("UNAM");
            autor1.setBiografia("Experto en bd");
            autor1.setOrcid("14514-8544-5511");

            Autor autor2 = new Autor();
            autor2.setNombres("Ana");
            autor2.setApellidos("Lopez");
            autor2.setEmail("alopez@gmail.com");
            autor2.setAfiliacion("UNMSM");
            autor2.setBiografia("Experto en IA");
            autor2.setOrcid("14514-85433-5511");

            autorRepository.saveAll(List.of(autor1, autor2));
            System.out.println("Se registraron " + autorRepository.count() + " autores");

            Libro libro1 = new Libro();
            libro1.setAutor(autor1);
            libro1.setTitulo("Inteligencia Artificial Tomo 1");
            libro1.setResumen("Apuntes de IA");
            libro1.setAutorPrincipalId(autor1.getId());
            libro1.setTipo(TipoPublicacion.LIBRO);
            libro1.setIsbn("789-455-85-88");
            libro1.setNumeroPaginas(250);
            libro1.setMetadatos("{\"anioPublicacion\": 2021, \"editorial\": \"ESPE\", \"genero\": \"SOFTWARE\"}");

            Libro libro2 = new Libro();
            libro2.setAutor(autor2);
            libro2.setTitulo("Arquitectura de Software");
            libro2.setResumen("Apuntes de Arq");
            libro2.setAutorPrincipalId(autor2.getId());
            libro2.setTipo(TipoPublicacion.LIBRO);
            libro2.setIsbn("789-455-85-88-555");
            libro2.setNumeroPaginas(250);
            libro2.setMetadatos("{\"anioPublicacion\": 2021, \"editorial\": \"ESPE\", \"genero\": \"SOFTWARE\"}");

            try {
                libroRepository.saveAll(List.of(libro1, libro2));
                System.out.println("Se registraron " + libroRepository.count() + " libros");
            } catch (Exception e) {
                System.err.println("Error al guardar libros: " + e.getMessage());
            }

            try {
                Paper paper1 = new Paper();
                paper1.setAutor(autor1);
                paper1.setTitulo("Impacto de la Inteligencia Artificial en Educacion Superior");
                paper1.setResumen("Apuntes de IA");
                paper1.setAutorPrincipalId(autor1.getId());
                paper1.setTipo(TipoPublicacion.ARTICULO);
                paper1.setRevistaObjetivo("Espe");
                paper1.setDoi("10.1000/123456");
                paper1.setMetadatos("{\"anioPublicacion\": 2021, \"editorial\": \"ESPE\", \"isbn\": \"789-455-85-88-574\", \"indexacion\": \"Scopus\", \"areaInvestigacion\": \"IA\"}");
                paperRepository.saveAll(List.of(paper1));
                System.out.println("Se registraron " + paperRepository.count() + " papers");
            } catch (Exception e) {
                System.err.println("Error al guardar papers: " + e.getMessage());
            }
        } else {
            System.out.println("Ya existen registros en la base de datos. NO SE CARGARON LOS DATOS INICIALES");
        }
        } catch (Exception e) {
            System.err.println("Error en DataLoad: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

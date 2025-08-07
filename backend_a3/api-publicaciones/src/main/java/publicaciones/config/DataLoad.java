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
        if (autorRepository.count() == 0) {
            Autor autor1 = new Autor();
            autor1.setNombre("Alex");
            autor1.setApellido("Garcia");
            autor1.setEmail("alex@gmail.com");
            autor1.setNacionalidad("Mexicano");
            autor1.setInstitucion("UNAM");
            autor1.setBiografia("Experto en bd");
            autor1.setOrcid("14514-8544-5511");

            Autor autor2 = new Autor();
            autor2.setNombre("Ana");
            autor2.setApellido("Lopez");
            autor2.setEmail("alopez@gmail.com");
            autor2.setNacionalidad("Peruana");
            autor2.setInstitucion("UNMSM");
            autor2.setBiografia("Experto en IA");
            autor2.setOrcid("14514-85433-5511");

            autorRepository.saveAll(List.of(autor1, autor2));
            System.out.println("Se registraron " + autorRepository.count() + " autores");

            Libro libro1 = new Libro();
            libro1.setAutor(autor1);
            libro1.setTitulo("Inteligencia Artificial Tomo 1");
            libro1.setAnioPublicacion(2021);
            libro1.setEditorial("ESPE");
            libro1.setIsbn("789-455-85-88");
            libro1.setResumen("Apuntes de IA");
            libro1.setGenero("SOFTWARE");
            libro1.setNumeroPaginas(250);

            Libro libro2 = new Libro();
            libro2.setAutor(autor2);
            libro2.setTitulo("Arquitectura de Software");
            libro2.setAnioPublicacion(2021);
            libro2.setEditorial("ESPE");
            libro2.setIsbn("789-455-85-88-555");
            libro2.setResumen("Apuntes de Arq");
            libro2.setGenero("SOFTWARE");
            libro2.setNumeroPaginas(250);

            libroRepository.saveAll(List.of(libro1, libro2));
            System.out.println("Se registraron " + libroRepository.count() + " libros");

            Paper paper1 = new Paper();
            paper1.setAutor(autor1);
            paper1.setTitulo("Impacto de la Inteligencia Artificial en Educacion Superior");
            paper1.setAnioPublicacion(2021);
            paper1.setEditorial("ESPE");
            paper1.setIsbn("789-455-85-88-574");
            paper1.setResumen("Apuntes de IA");
            paper1.setRevista("Espe");
            paper1.setIndexacion("Scopus");
            paper1.setAreaInvestigacion("IA");
            paperRepository.saveAll(List.of(paper1));

            System.out.println("Se registraron " + paperRepository.count() + " papers");
        } else {
            System.out.println("Ya existen registros en la base de datos. NO SE CARGARON LOS DATOS INICIALES");
        }
    }
}

package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import publicaciones.model.Libro;

import java.util.UUID;

public interface LibroRepository extends JpaRepository<Libro, UUID> {
}

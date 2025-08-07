package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import publicaciones.model.Autor;

import java.util.UUID;

public interface AutorRepository extends JpaRepository<Autor, UUID> {
}

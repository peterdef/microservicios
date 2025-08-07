package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import publicaciones.model.Paper;

import java.util.UUID;

public interface PaperRepository extends JpaRepository<Paper, UUID> {
}

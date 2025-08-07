package ec.edu.espe.notificaciones.repository;

import ec.edu.espe.notificaciones.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificacionRepository extends JpaRepository<Notificacion,Long> {
}

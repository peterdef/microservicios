package ec.edu.espe.notificaciones.repository;

import ec.edu.espe.notificaciones.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, UUID> {
    
    List<Notificacion> findByDestinatarioIdOrderByFechaCreacionDesc(String destinatarioId);
    
    List<Notificacion> findByEstadoEnvio(String estadoEnvio);
    
    List<Notificacion> findByEstadoEnvioAndIntentosEnvioLessThan(String estadoEnvio, Integer intentosMaximos);
    
    List<Notificacion> findByTipoAndDestinatarioId(String tipo, String destinatarioId);
    
    List<Notificacion> findByCanalEnvioAndEstadoEnvio(String canalEnvio, String estadoEnvio);
}

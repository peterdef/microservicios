package ec.edu.espe.notificaciones.service;

import com.netflix.discovery.converters.Auto;
import ec.edu.espe.notificaciones.dto.NotificacionDto;
import ec.edu.espe.notificaciones.entity.Notificacion;
import ec.edu.espe.notificaciones.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    public void guardarNotificacion(NotificacionDto notificacionDto) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(notificacionDto.getTipo());
        notificacion.setMensaje(notificacionDto.getMensaje());
        notificacion.setFecha(LocalDateTime.now());

        notificacionRepository.save(notificacion);
    }

    public List<Notificacion> listarNotificaciones() {
        return notificacionRepository.findAll();
    }
}

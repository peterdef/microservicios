package ec.edu.espe.notificaciones.service;

import ec.edu.espe.notificaciones.entity.Notificacion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    public void enviarEmail(Notificacion notificacion) {
        // Simulación de envío de email
        log.info("Enviando email a: {} - Título: {} - Mensaje: {}", 
                notificacion.getDestinatarioEmail(), 
                notificacion.getTitulo(), 
                notificacion.getMensaje());
        
        // Aquí se implementaría la lógica real de envío de email
        // usando JavaMailSender o servicios como SendGrid, AWS SES, etc.
    }
}

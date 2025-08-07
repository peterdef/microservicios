package ec.edu.espe.notificaciones.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notificaciones")
@Getter
@Setter
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Column(nullable = false)
    private String tipo; // EMAIL, WEBSOCKET, PUSH, SMS

    @Column(name = "destinatario_id", nullable = false)
    private String destinatarioId;

    @Column(name = "destinatario_email")
    private String destinatarioEmail;

    @Column(name = "canal_envio", nullable = false)
    private String canalEnvio; // EMAIL, WEBSOCKET, PUSH, SMS

    @Column(name = "estado_envio", nullable = false)
    private String estadoEnvio = "PENDIENTE"; // PENDIENTE, ENVIADO, ERROR

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "intentos_envio")
    private Integer intentosEnvio = 0;

    @Column(name = "error_mensaje")
    private String errorMensaje;

    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata; // JSON con datos adicionales

    @Column(name = "prioridad")
    private String prioridad = "NORMAL"; // BAJA, NORMAL, ALTA, URGENTE

    @Column(name = "grupo_notificacion")
    private String grupoNotificacion; // Para agrupar notificaciones relacionadas
}

package publicaciones.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "outbox_events")
@Setter
@Getter
public class OutboxEvent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "aggregate_id", nullable = false)
    private UUID aggregateId;
    
    @Column(name = "aggregate_type", nullable = false)
    private String aggregateType;
    
    @Column(name = "event_type", nullable = false)
    private String eventType;
    
    @Column(name = "payload_json", columnDefinition = "TEXT", nullable = false)
    private String payloadJson;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOutbox estado = EstadoOutbox.PENDIENTE;
    
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;
    
    @Column(name = "intentos_envio")
    private Integer intentosEnvio = 0;
    
    @Column(name = "error_mensaje")
    private String errorMensaje;
    
    public enum EstadoOutbox {
        PENDIENTE("Pendiente"),
        ENVIADO("Enviado"),
        ERROR("Error");
        
        private final String descripcion;
        
        EstadoOutbox(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}

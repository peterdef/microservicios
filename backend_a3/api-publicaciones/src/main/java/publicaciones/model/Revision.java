package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "revisiones")
@Setter
@Getter
public class Revision {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "publicacion_id", nullable = false)
    private UUID publicacionId;
    
    @Column(name = "revisor_id", nullable = false)
    private UUID revisorId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_revision", nullable = false)
    private EstadoRevision estadoRevision = EstadoRevision.PENDIENTE;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "historial_cambios", columnDefinition = "TEXT")
    private String historialCambios;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_asignacion")
    private LocalDateTime fechaAsignacion = LocalDateTime.now();
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;
    
    @Column(name = "puntuacion_calidad")
    private Integer puntuacionCalidad; // 1-10
    
    @Column(name = "recomendacion")
    private String recomendacion; // ACEPTAR, SOLICITAR_CAMBIOS, RECHAZAR
    
    public enum EstadoRevision {
        PENDIENTE("Pendiente"),
        EN_PROCESO("En Proceso"),
        DEVUELTA("Devuelta"),
        ACEPTADA("Aceptada"),
        RECHAZADA("Rechazada");
        
        private final String descripcion;
        
        EstadoRevision(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}

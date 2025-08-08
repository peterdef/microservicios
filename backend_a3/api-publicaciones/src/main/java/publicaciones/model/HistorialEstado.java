package publicaciones.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "historial_estados")
@Setter
@Getter
public class HistorialEstado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "publicacion_id", nullable = false)
    private UUID publicacionId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private EstadoPublicacion estadoAnterior;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false)
    private EstadoPublicacion estadoNuevo;
    
    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;
    
    @Column(name = "usuario_nombre")
    private String usuarioNombre;
    
    @Column(name = "rol_usuario")
    private String rolUsuario;
    
    @Column(columnDefinition = "TEXT")
    private String comentarios;
    
    @Column(name = "motivo_cambio")
    private String motivoCambio; // APROBACION, REVISION, CAMBIOS_SOLICITADOS, PUBLICACION
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "fecha_cambio", nullable = false)
    private LocalDateTime fechaCambio = LocalDateTime.now();
    
    @Column(name = "ip_origen")
    private String ipOrigen;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata; // JSON con datos adicionales del cambio
}


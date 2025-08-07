package publicaciones.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class PublicationEvent {
    private UUID eventId = UUID.randomUUID();
    private LocalDateTime timestamp = LocalDateTime.now();
    private UUID publicationId;
    private String eventType;
    private String userId;
    private String userRole;
    private String metadata; // JSON string con datos adicionales
}

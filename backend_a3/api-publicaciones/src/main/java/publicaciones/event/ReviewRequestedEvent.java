package publicaciones.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewRequestedEvent extends PublicationEvent {
    private UUID revisorId;
    private String reviewType; // BLIND, DOUBLE_BLIND, OPEN
    
    public ReviewRequestedEvent() {
        setEventType("ReviewRequested");
    }
}

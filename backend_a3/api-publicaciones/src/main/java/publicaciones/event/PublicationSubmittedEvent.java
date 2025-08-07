package publicaciones.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PublicationSubmittedEvent extends PublicationEvent {
    public PublicationSubmittedEvent() {
        setEventType("PublicationSubmitted");
    }
}

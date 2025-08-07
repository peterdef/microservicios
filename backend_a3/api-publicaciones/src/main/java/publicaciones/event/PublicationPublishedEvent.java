package publicaciones.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PublicationPublishedEvent extends PublicationEvent {
    private String publicationUrl;
    private String doi;
    private String isbn;
    
    public PublicationPublishedEvent() {
        setEventType("PublicationPublished");
    }
}

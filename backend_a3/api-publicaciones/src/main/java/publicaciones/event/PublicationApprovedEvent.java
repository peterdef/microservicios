package publicaciones.event;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PublicationApprovedEvent extends PublicationEvent {
    private String approvalComments;
    private String approvedBy;
    
    public PublicationApprovedEvent() {
        setEventType("PublicationApproved");
    }
}

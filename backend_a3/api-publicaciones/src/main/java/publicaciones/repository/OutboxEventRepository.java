package publicaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import publicaciones.model.OutboxEvent;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, UUID> {
    
    @Query("SELECT o FROM outbox_events o WHERE o.estado = 'PENDIENTE' ORDER BY o.fechaCreacion ASC")
    List<OutboxEvent> findPendingEvents();
    
    @Query("SELECT o FROM outbox_events o WHERE o.estado = 'ERROR' AND o.intentosEnvio < 3 ORDER BY o.fechaCreacion ASC")
    List<OutboxEvent> findFailedEventsWithRetries();
    
    List<OutboxEvent> findByAggregateId(UUID aggregateId);
    
    List<OutboxEvent> findByEventType(String eventType);
}

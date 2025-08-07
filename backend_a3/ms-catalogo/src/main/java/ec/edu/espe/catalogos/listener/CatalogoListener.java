package ec.edu.espe.catalogos.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import ec.edu.espe.catalogos.dto.PublicacionCatalogoDto;
import ec.edu.espe.catalogos.service.CatalogoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CatalogoListener {

    private final CatalogoService catalogoService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "catalog.publications")
    public void recibirPublicacionPublicada(String mensajeJson) {
        try {
            log.info("Recibido evento de publicación publicada: {}", mensajeJson);
            
            // Parsear el evento de publicación publicada
            PublicacionCatalogoDto dto = objectMapper.readValue(mensajeJson, PublicacionCatalogoDto.class);
            
            // Indexar la publicación en el catálogo
            catalogoService.indexarPublicacion(dto);
            
            log.info("Publicación indexada exitosamente en catálogo: {}", dto.getTitulo());
            
        } catch (Exception e) {
            log.error("Error procesando evento de publicación publicada: {}", e.getMessage(), e);
        }
    }

    @RabbitListener(queues = "catalog.publications.retiradas")
    public void recibirPublicacionRetirada(String mensajeJson) {
        try {
            log.info("Recibido evento de publicación retirada: {}", mensajeJson);
            
            // Parsear el evento de publicación retirada
            // Asumiendo que el mensaje contiene el ID de la publicación original
            String publicacionId = objectMapper.readValue(mensajeJson, String.class);
            
            // Desindexar la publicación del catálogo
            catalogoService.desindexarPublicacion(java.util.UUID.fromString(publicacionId));
            
            log.info("Publicación desindexada exitosamente del catálogo: {}", publicacionId);
            
        } catch (Exception e) {
            log.error("Error procesando evento de publicación retirada: {}", e.getMessage(), e);
        }
    }
}

package ec.edu.espe.catalogos.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Queues para el catálogo
    public static final String CATALOG_PUBLICATIONS_QUEUE = "catalog.publications";
    public static final String CATALOG_PUBLICATIONS_RETIRADAS_QUEUE = "catalog.publications.retiradas";
    
    // Exchange principal (debe coincidir con el de publicaciones)
    public static final String PUBLICATION_EVENTS_EXCHANGE = "publication.events";
    
    // Routing keys
    public static final String PUBLICATION_PUBLISHED_KEY = "publication.published";
    public static final String PUBLICATION_RETIRED_KEY = "publication.retired";

    @Bean
    public Queue catalogPublicationsQueue() {
        return QueueBuilder.durable(CATALOG_PUBLICATIONS_QUEUE)
                .withArgument("x-message-ttl", 86400000) // 24 horas
                .build();
    }

    @Bean
    public Queue catalogPublicationsRetiradasQueue() {
        return QueueBuilder.durable(CATALOG_PUBLICATIONS_RETIRADAS_QUEUE)
                .withArgument("x-message-ttl", 86400000) // 24 horas
                .build();
    }

    @Bean
    public TopicExchange publicationEventsExchange() {
        return new TopicExchange(PUBLICATION_EVENTS_EXCHANGE, true, false);
    }

    // Binding para publicaciones publicadas
    @Bean
    public Binding catalogPublicationsBinding() {
        return BindingBuilder.bind(catalogPublicationsQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_PUBLISHED_KEY);
    }

    // Binding para publicaciones retiradas
    @Bean
    public Binding catalogPublicationsRetiradasBinding() {
        return BindingBuilder.bind(catalogPublicationsRetiradasQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_RETIRED_KEY);
    }
}

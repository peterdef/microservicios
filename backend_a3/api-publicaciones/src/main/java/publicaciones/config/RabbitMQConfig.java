package publicaciones.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Exchange principal para eventos de publicación
    public static final String PUBLICATION_EVENTS_EXCHANGE = "publication.events";
    
    // Queues específicas
    public static final String CATALOG_PUBLICATIONS_QUEUE = "catalog.publications";
    public static final String NOTIFICATIONS_ACTIVITY_QUEUE = "notifications.activity";
    public static final String ANALYTICS_QUEUE = "analytics.optional";
    
    // Routing keys
    public static final String PUBLICATION_SUBMITTED_KEY = "publication.submitted";
    public static final String PUBLICATION_REVIEW_REQUESTED_KEY = "publication.review.requested";
    public static final String PUBLICATION_REVIEW_RETURNED_KEY = "publication.review.returned";
    public static final String PUBLICATION_APPROVED_KEY = "publication.approved";
    public static final String PUBLICATION_PUBLISHED_KEY = "publication.published";
    public static final String USER_REGISTERED_KEY = "user.registered";
    public static final String USER_LOGIN_KEY = "user.login";

    @Bean
    public TopicExchange publicationEventsExchange() {
        return new TopicExchange(PUBLICATION_EVENTS_EXCHANGE, true, false);
    }

    @Bean
    public Queue catalogPublicationsQueue() {
        return QueueBuilder.durable(CATALOG_PUBLICATIONS_QUEUE)
                .withArgument("x-message-ttl", 86400000) // 24 horas
                .build();
    }

    @Bean
    public Queue notificationsActivityQueue() {
        return QueueBuilder.durable(NOTIFICATIONS_ACTIVITY_QUEUE)
                .withArgument("x-message-ttl", 86400000) // 24 horas
                .build();
    }

    @Bean
    public Queue analyticsQueue() {
        return QueueBuilder.durable(ANALYTICS_QUEUE)
                .withArgument("x-message-ttl", 604800000) // 7 días
                .build();
    }

    // Bindings para Catálogo (solo publicaciones publicadas)
    @Bean
    public Binding catalogPublicationsBinding() {
        return BindingBuilder.bind(catalogPublicationsQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_PUBLISHED_KEY);
    }

    // Bindings para Notificaciones (todos los eventos de publicación)
    @Bean
    public Binding notificationsPublicationSubmittedBinding() {
        return BindingBuilder.bind(notificationsActivityQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_SUBMITTED_KEY);
    }

    @Bean
    public Binding notificationsReviewRequestedBinding() {
        return BindingBuilder.bind(notificationsActivityQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_REVIEW_REQUESTED_KEY);
    }

    @Bean
    public Binding notificationsReviewReturnedBinding() {
        return BindingBuilder.bind(notificationsActivityQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_REVIEW_RETURNED_KEY);
    }

    @Bean
    public Binding notificationsApprovedBinding() {
        return BindingBuilder.bind(notificationsActivityQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_APPROVED_KEY);
    }

    @Bean
    public Binding notificationsPublishedBinding() {
        return BindingBuilder.bind(notificationsActivityQueue())
                .to(publicationEventsExchange())
                .with(PUBLICATION_PUBLISHED_KEY);
    }

    // Bindings para Analytics (todos los eventos)
    @Bean
    public Binding analyticsAllEventsBinding() {
        return BindingBuilder.bind(analyticsQueue())
                .to(publicationEventsExchange())
                .with("publication.*");
    }

    @Bean
    public Binding analyticsUserEventsBinding() {
        return BindingBuilder.bind(analyticsQueue())
                .to(publicationEventsExchange())
                .with("user.*");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}

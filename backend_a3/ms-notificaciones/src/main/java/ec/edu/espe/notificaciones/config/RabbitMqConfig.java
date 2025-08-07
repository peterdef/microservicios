package ec.edu.espe.notificaciones.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    @Bean
    public Queue notificacionesQueue(){
        return QueueBuilder.durable("queue.notificaciones").build();
    }
}

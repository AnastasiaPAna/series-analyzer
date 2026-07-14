package org.example.series.integration.notification;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitNotificationConfig {

    @Bean
    Queue emailNotificationQueue(@Value("${EMAIL_NOTIFICATION_QUEUE:series-email.notifications}") String queueName) {
        return QueueBuilder.durable(queueName).build();
    }

    @Bean
    DirectExchange emailNotificationExchange(@Value("${EMAIL_NOTIFICATION_EXCHANGE:series.notifications}") String exchangeName) {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    Binding emailNotificationBinding(Queue emailNotificationQueue,
                                     DirectExchange emailNotificationExchange,
                                     @Value("${EMAIL_NOTIFICATION_ROUTING_KEY:email.notification}") String routingKey) {
        return BindingBuilder.bind(emailNotificationQueue).to(emailNotificationExchange).with(routingKey);
    }

    @Bean
    MessageConverter rabbitJsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}

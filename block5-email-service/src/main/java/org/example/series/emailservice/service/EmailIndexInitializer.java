package org.example.series.emailservice.service;

import org.example.series.emailservice.model.EmailMessageDocument;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.IndexOperations;

@Configuration
public class EmailIndexInitializer {

    @Bean
    @ConditionalOnProperty(name = "app.email.elasticsearch.init.enabled", havingValue = "true", matchIfMissing = true)
    ApplicationRunner emailIndexRunner(ElasticsearchOperations operations) {
        return args -> {
            IndexOperations indexOps = operations.indexOps(EmailMessageDocument.class);
            if (!indexOps.exists()) {
                indexOps.create();
                indexOps.putMapping(indexOps.createMapping(EmailMessageDocument.class));
            }
        };
    }
}

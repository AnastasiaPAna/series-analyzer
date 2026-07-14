package org.example.series.emailservice.repository;

import org.example.series.emailservice.model.EmailDeliveryStatus;
import org.example.series.emailservice.model.EmailMessageDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface EmailMessageRepository extends ElasticsearchRepository<EmailMessageDocument, String> {

    List<EmailMessageDocument> findTop100ByStatusOrderByLastAttemptAtAsc(EmailDeliveryStatus status);

    List<EmailMessageDocument> findTop100ByOrderByCreatedAtDesc();

    List<EmailMessageDocument> findTop100ByStatusOrderByCreatedAtDesc(EmailDeliveryStatus status);
}

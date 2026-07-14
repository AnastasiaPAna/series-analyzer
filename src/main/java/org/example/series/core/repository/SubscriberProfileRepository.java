package org.example.series.core.repository;

import org.example.series.core.model.SubscriberProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubscriberProfileRepository extends JpaRepository<SubscriberProfile, Long> {

    List<SubscriberProfile> findAllByOrderByUpdatedAtDesc();

    Optional<SubscriberProfile> findByEmailIgnoreCase(String email);

    Optional<SubscriberProfile> findByAuthToken(String authToken);

    long countByLastSeenAtAfter(LocalDateTime after);

    long countByNotifyNewSeriesTrue();

    long countByNotifyNewSeasonTrue();

    List<SubscriberProfile> findByNotifyNewSeriesTrueOrderByUpdatedAtDesc();

    List<SubscriberProfile> findByNotifyNewSeasonTrueOrderByUpdatedAtDesc();
}

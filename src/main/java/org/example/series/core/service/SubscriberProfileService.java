package org.example.series.core.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.series.api.dto.SubscriberLoginRequest;
import org.example.series.api.dto.SubscriberOverviewResponse;
import org.example.series.api.dto.SubscriberProfileRequest;
import org.example.series.api.dto.SubscriberProfileResponse;
import org.example.series.api.dto.SubscriberRegistrationRequest;
import org.example.series.api.dto.SubscriberSessionResponse;
import org.example.series.core.model.SubscriberProfile;
import org.example.series.core.repository.SubscriberProfileRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class SubscriberProfileService {

    private static final int ACTIVE_WINDOW_MINUTES = 15;
    private static final String LEGACY_IMPORTED_PASSWORD_HASH = "$2a$10$S9a0c8yR9rwQIlFZLxM7z.1FobqdMI9D0PfrxGX2YeliYg5OtTS2K";
    private static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    private final SubscriberProfileRepository repository;

    public SubscriberProfileService(SubscriberProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SubscriberSessionResponse register(SubscriberRegistrationRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        SubscriberProfile profile = repository.findByEmailIgnoreCase(normalizedEmail)
                .map(existing -> {
                    if (!LEGACY_IMPORTED_PASSWORD_HASH.equals(existing.getPasswordHash())) {
                        throw new ResponseStatusException(CONFLICT, "An account with this email already exists");
                    }
                    return existing;
                })
                .orElseGet(SubscriberProfile::new);

        profile.setName(request.getName().trim());
        profile.setEmail(normalizedEmail);
        profile.setPasswordHash(PASSWORD_ENCODER.encode(request.getPassword()));
        profile.setNotifyNewSeries(Boolean.TRUE.equals(request.getNotifyNewSeries()));
        profile.setNotifyNewSeason(Boolean.TRUE.equals(request.getNotifyNewSeason()));
        issueSession(profile);

        SubscriberProfile saved = repository.save(profile);
        return new SubscriberSessionResponse(saved.getAuthToken(), toResponse(saved));
    }

    @Transactional
    public SubscriberSessionResponse login(SubscriberLoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        SubscriberProfile profile = repository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Invalid email or password"));

        if (!PASSWORD_ENCODER.matches(request.getPassword(), profile.getPasswordHash())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid email or password");
        }

        issueSession(profile);
        SubscriberProfile saved = repository.save(profile);
        return new SubscriberSessionResponse(saved.getAuthToken(), toResponse(saved));
    }

    @Transactional
    public void logout(String authToken) {
        SubscriberProfile profile = getProfileByToken(authToken);
        profile.setAuthToken(null);
        profile.setAuthTokenIssuedAt(null);
        repository.save(profile);
    }

    public SubscriberProfileResponse getCurrentProfile(String authToken) {
        return toResponse(getProfileByToken(authToken));
    }

    @Transactional
    public SubscriberProfileResponse updateCurrentProfile(String authToken, SubscriberProfileRequest request) {
        SubscriberProfile profile = getProfileByToken(authToken);
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        repository.findByEmailIgnoreCase(normalizedEmail)
                .filter(existing -> !existing.getId().equals(profile.getId()))
                .ifPresent(existing -> {
                    throw new ResponseStatusException(CONFLICT, "Another account already uses this email");
                });

        profile.setName(request.getName().trim());
        profile.setEmail(normalizedEmail);
        profile.setNotifyNewSeries(Boolean.TRUE.equals(request.getNotifyNewSeries()));
        profile.setNotifyNewSeason(Boolean.TRUE.equals(request.getNotifyNewSeason()));
        profile.setLastSeenAt(LocalDateTime.now());
        return toResponse(repository.save(profile));
    }

    @Transactional
    public SubscriberProfileResponse markSeen(String authToken) {
        SubscriberProfile profile = getProfileByToken(authToken);
        profile.setLastSeenAt(LocalDateTime.now());
        return toResponse(repository.save(profile));
    }

    public SubscriberOverviewResponse getOverview() {
        LocalDateTime activeAfter = LocalDateTime.now().minusMinutes(ACTIVE_WINDOW_MINUTES);
        List<SubscriberProfileResponse> subscribers = repository.findAllByOrderByUpdatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();

        return new SubscriberOverviewResponse(
                repository.count(),
                repository.countByLastSeenAtAfter(activeAfter),
                repository.countByNotifyNewSeriesTrue(),
                repository.countByNotifyNewSeasonTrue(),
                subscribers
        );
    }

    public List<String> getRecipientEmailsForNewSeries() {
        return repository.findByNotifyNewSeriesTrueOrderByUpdatedAtDesc()
                .stream()
                .map(SubscriberProfile::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        List::copyOf
                ));
    }

    public List<String> getRecipientEmailsForNewSeason() {
        return repository.findByNotifyNewSeasonTrueOrderByUpdatedAtDesc()
                .stream()
                .map(SubscriberProfile::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        List::copyOf
                ));
    }

    private SubscriberProfile getProfileByToken(String authToken) {
        String normalizedToken = authToken == null ? "" : authToken.trim();
        if (normalizedToken.isBlank()) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing subscriber session");
        }

        return repository.findByAuthToken(normalizedToken)
                .orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED, "Subscriber session is not valid"));
    }

    private void issueSession(SubscriberProfile profile) {
        LocalDateTime now = LocalDateTime.now();
        profile.setAuthToken(UUID.randomUUID().toString());
        profile.setAuthTokenIssuedAt(now);
        profile.setLastSeenAt(now);
    }

    private SubscriberProfileResponse toResponse(SubscriberProfile profile) {
        LocalDateTime activeAfter = LocalDateTime.now().minusMinutes(ACTIVE_WINDOW_MINUTES);
        return new SubscriberProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getEmail(),
                profile.isNotifyNewSeries(),
                profile.isNotifyNewSeason(),
                profile.getLastSeenAt() != null && profile.getLastSeenAt().isAfter(activeAfter),
                profile.getCreatedAt(),
                profile.getUpdatedAt(),
                profile.getLastSeenAt()
        );
    }
}

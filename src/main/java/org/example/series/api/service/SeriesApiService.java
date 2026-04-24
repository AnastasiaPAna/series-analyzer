package org.example.series.api.service;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.example.series.api.dto.SeriesListRequest;
import org.example.series.api.dto.SeriesImportItem;
import org.example.series.api.dto.SeriesRequest;
import org.example.series.api.dto.SeriesResponse;
import org.example.series.api.mapper.SeriesMapper;
import org.example.series.core.export.ReportCsvWriter;
import org.example.series.core.export.ReportExcelWriter;
import org.example.series.core.export.ReportJsonWriter;
import org.example.series.core.export.ReportStore;
import org.example.series.core.model.Series;
import org.example.series.core.service.SeriesService;
import org.example.series.core.service.StudioService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;



/**
 * API-level service that orchestrates requests, delegates to core services, maps entities to DTOs and handles report/download/upload flows.
 */
@Service

public class SeriesApiService {

    private final SeriesService seriesService;
    private final StudioService studioService;
    private final ReportStore reportStore;
    private final Validator validator;
    private final Gson gson = new Gson();

    public SeriesApiService(SeriesService seriesService,
                           StudioService studioService,
                           ReportStore reportStore,
                           Validator validator) {
        this.seriesService = seriesService;
        this.studioService = studioService;
        this.reportStore = reportStore;
        this.validator = validator;
    }

    // -------- CRUD --------

    public SeriesResponse create(SeriesRequest request) {
        Series entity = SeriesMapper.toEntity(request);
        Series saved = seriesService.create(entity, request.getStudioId());
        return SeriesMapper.toResponse(saved);
    }

    public List<SeriesResponse> getAll() {
        return seriesService.findAll()
                .stream()
                .map(SeriesMapper::toResponse)
                .toList();
    }

    public SeriesResponse getById(Long id) {
        return SeriesMapper.toResponse(seriesService.findById(id));
    }

    public SeriesResponse update(Long id, SeriesRequest request) {
        Series entity = SeriesMapper.toEntity(request);
        Series updated = seriesService.update(id, entity, request.getStudioId());
        return SeriesMapper.toResponse(updated);
    }

    public void delete(Long id) {
        seriesService.delete(id);
    }

    public List<SeriesResponse> top(int n) {
        return seriesService.topNByRating(n)
                .stream()
                .map(SeriesMapper::toResponse)
                .toList();
    }

    public SeriesResponse search(String query) {
        return SeriesMapper.toResponse(seriesService.findByTitle(query));
    }

    // -------- LIST (filters + pageable) --------

    public Page<SeriesResponse> search(
            Long studioId,
            Double minRating,
            Integer year,
            String genre,
            Pageable pageable) {

        return seriesService.search(
                studioId,
                minRating,
                year,
                genre,
                pageable
        ).map(SeriesMapper::toResponse);
    }

    // -------- REPORT --------

    public ResponseEntity<?> generateReport(SeriesListRequest request) {

        String format = request.getFormat();
        if (format == null || format.isBlank()) format = "csv";
        format = format.toLowerCase(Locale.ROOT);

        boolean async = Boolean.TRUE.equals(request.getAsync());

        List<Series> list = seriesService.search(
                request.getStudioId(),
                request.getMinRating(),
                request.getYear(),
                request.getGenre(),
                Pageable.unpaged()
        ).getContent();

        String baseName = "series-report-" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        // ---- ASYNC ----
        if (async) {
            String jobId = UUID.randomUUID().toString();

            byte[] data = switch (format) {
                case "xlsx" -> ReportExcelWriter.write(list);
                case "json" -> ReportJsonWriter.write(list);
                default -> ReportCsvWriter.write(list);
            };

            String filename = switch (format) {
                case "xlsx" -> baseName + ".xlsx";
                case "json" -> baseName + ".json";
                default -> baseName + ".csv";
            };

            String contentType = switch (format) {
                case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                case "json" -> MediaType.APPLICATION_JSON_VALUE;
                default -> "text/csv";
            };

            reportStore.put(jobId, data, filename, contentType);

            return ResponseEntity.accepted().body(Map.of(
                    "jobId", jobId,
                    "downloadUrl", "/api/v1/series/_report/" + jobId
            ));
        }

        // ---- SYNC ----
        return switch (format) {
            case "xlsx" -> buildResponse(
                    ReportExcelWriter.write(list),
                    baseName + ".xlsx",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            case "json" -> buildResponse(
                    ReportJsonWriter.write(list),
                    baseName + ".json",
                    MediaType.APPLICATION_JSON_VALUE
            );
            default -> buildResponse(
                    ReportCsvWriter.write(list),
                    baseName + ".csv",
                    "text/csv"
            );
        };
    }

    public ResponseEntity<byte[]> downloadReport(String jobId) {
        ReportStore.ReportResult result = reportStore.get(jobId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + result.filename() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, result.contentType())
                .body(result.data());
    }

    private ResponseEntity<byte[]> buildResponse(byte[] data,
                                                 String filename,
                                                 String contentType) {

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(data);
    }

    // -------- UPLOAD --------

    public Map<String, Object> upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        int success = 0;
        int failed = 0;
        List<Map<String, Object>> errors = new ArrayList<>();

        try (InputStream in = file.getInputStream()) {

            // Streaming JSON parsing to support large files (Task 1 requirement)
            JsonReader reader = new JsonReader(new InputStreamReader(in, StandardCharsets.UTF_8));
            reader.beginArray();

            int index = 0;
            while (reader.hasNext()) {
                index++;
                SeriesImportItem item = gson.fromJson(reader, SeriesImportItem.class);
                try {
                    SeriesRequest req = toRequest(item);

                    // validate each item (same rules as for REST create)
                    Set<ConstraintViolation<SeriesRequest>> violations = validator.validate(req);
                    if (!violations.isEmpty()) {
                        failed++;
                        errors.add(Map.of(
                                "index", index,
                                "reason", "validation",
                                "details", violations.stream()
                                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                                        .collect(Collectors.toList())
                        ));
                        continue;
                    }

                    create(req);
                    success++;

                } catch (Exception e) {
                    failed++;
                    errors.add(Map.of(
                            "index", index,
                            "reason", "import",
                            "details", e.getMessage() == null ? "error" : e.getMessage()
                    ));
                }
            }

            reader.endArray();

        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JSON file");
        }

        // keep response small: return only first 20 errors
        return Map.of(
                "success", success,
                "failed", failed,
                "errors", errors.stream().limit(20).toList()
        );
    }

    private SeriesRequest toRequest(SeriesImportItem item) {
        if (item == null) throw new IllegalArgumentException("Empty item");
        if (item.getStudio() == null || item.getStudio().getName() == null || item.getStudio().getName().isBlank()) {
            throw new IllegalArgumentException("Studio name is required");
        }

        Long studioId = studioService.findByName(item.getStudio().getName()).getId();

        SeriesRequest req = new SeriesRequest();
        req.setTitle(item.getTitle());
        req.setGenre(item.getGenre());
        req.setSeasons(item.getSeasons() == null ? 0 : item.getSeasons());
        req.setRating(item.getRating() == null ? 0.0 : item.getRating());
        req.setYear(item.getYear() == null ? 0 : item.getYear());
        req.setFinished(item.getFinished());
        req.setStudioId(studioId);
        return req;
    }
}

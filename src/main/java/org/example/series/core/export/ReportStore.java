package org.example.series.core.export;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;



/**
 * In-memory store for reports.
 */
@Component

public class ReportStore {

    public record ReportResult(byte[] data, String filename, String contentType) {}

    private final ConcurrentHashMap<String, ReportResult> store = new ConcurrentHashMap<>();

    public void put(String jobId, byte[] data, String filename, String contentType) {
        store.put(jobId, new ReportResult(data, filename, contentType));
    }

    public ReportResult get(String jobId) {
        return store.get(jobId);
    }
}

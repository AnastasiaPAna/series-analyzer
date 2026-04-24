package org.example.series.core.export;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.example.series.core.model.Series;

import java.util.List;

/**
 * ReportJsonWriter
 *
 * Responsible for exporting a list of Series entities
 * into JSON format.
 *
 * Responsibilities:
 * - Serialize domain model (Series) into JSON structure
 * - Support Java 8+ Date/Time API (LocalDateTime, etc.)
 * - Handle Hibernate lazy proxies safely
 * - Produce pretty-printed JSON output
 *
 * Design notes:
 * - Stateless utility class
 * - No dependency on Spring
 * - Uses dedicated ObjectMapper instance
 * - Configured to support Hibernate 6 (Spring Boot 3 / Jakarta)
 *
 * WARNING:
 * This writer serializes Entity directly.
 * For strict architectural isolation, consider using DTO projection.
 */
/**
 * Writes report data to JSON format.
 */
public class ReportJsonWriter {

    /**
     * Dedicated ObjectMapper configured for:
     * - JavaTime support (LocalDateTime, etc.)
     * - Hibernate proxy handling
     * - ISO date formatting (not timestamps)
     */
    private static final ObjectMapper mapper = new ObjectMapper()
            // Support for Java time API
            .registerModule(new JavaTimeModule())

            // Support for Hibernate 6 proxies (Jakarta namespace)
            .registerModule(new Hibernate6Module())

            // Serialize dates as ISO-8601 strings instead of timestamps
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    /**
     * Converts list of Series into JSON byte array.
     * JSON structure:
     * [
     *   {
     *     "id": ...,
     *     "title": "...",
     *     "seasons": ...,
     *     ...
     *   }
     * ]
     *
     * @param list list of Series entities
     * @return pretty-printed JSON as byte array
     */
    public static byte[] write(List<Series> list) {
        try {
            return mapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsBytes(list);
        } catch (Exception e) {
            throw new RuntimeException("Failed to write JSON report", e);
        }
    }
}

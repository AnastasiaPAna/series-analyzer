package org.example.series.core.export;

import org.example.series.core.model.Series;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * ReportCsvWriter
 * Responsible for exporting a list of Series entities
 * into CSV format.
 * Responsibilities:
 * - Transform domain model (Series) into flat CSV structure
 * - Apply proper escaping for text fields
 * - Produce UTF-8 encoded byte array for HTTP response download
 * Design notes:
 * - Stateless utility class
 * - No dependency on Spring
 * - Works directly with domain model
 * - Follows SRP (Single Responsibility Principle)
 */
/**
 * Writes report data to CSV format.
 */
public class ReportCsvWriter {

    /**
     * Converts list of Series into CSV byte array.
     * CSV structure:
     * Title,Seasons,Rating,Year,Finished,Studio
     *
     * @param list list of Series entities to export
     * @return UTF-8 encoded CSV file as byte array
     */
    public static byte[] write(List<Series> list) {

        StringBuilder sb = new StringBuilder();

        // CSV header
        sb.append("Title,Seasons,Rating,Year,Finished,Studio\n");

        // Iterate through all records and build CSV rows
        for (Series s : list) {

            sb.append("\"").append(escape(s.getTitle())).append("\",")
                    .append(s.getSeasons()).append(",")
                    .append(s.getRating()).append(",")
                    .append(s.getYear()).append(",")
                    .append(s.isFinished()).append(",")
                    .append("\"").append(escape(s.getStudio().getName())).append("\"")
                    .append("\n");
        }

        // Convert to UTF-8 byte array for file download
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Escapes CSV value by:
     * - replacing inner quotes with double quotes
     * Example:
     *  Stranger "Things" -> Stranger ""Things""
     *
     * @param value raw string value
     * @return escaped value safe for CSV
     */
    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\"", "\"\"");
    }
}

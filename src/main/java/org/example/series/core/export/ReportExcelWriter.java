package org.example.series.core.export;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.series.core.model.Series;

import java.io.ByteArrayOutputStream;
import java.util.List;

/**
 * ReportExcelWriter
 * Responsible for exporting a list of Series entities
 * into Excel (.xlsx) format.
 * Responsibilities:
 * - Transform domain model (Series) into tabular Excel structure
 * - Create in-memory XLSX workbook using Apache POI
 * - Return generated file as byte array for HTTP download
 * Design notes:
 * - Stateless utility class
 * - No Spring dependency
 * - Uses XSSFWorkbook (in-memory workbook)
 * - Suitable for small/medium datasets
 * WARNING:
 * For very large datasets (50k+ rows),
 * consider using SXSSFWorkbook (streaming version).
 */
/**
 * Writes report data to Excel (XLSX) format.
 */
public class ReportExcelWriter {

    /**
     * Converts list of Series into Excel (.xlsx) byte array.
     *
     * Sheet structure:
     * | Title | Seasons | Rating | Year | Finished | Studio |
     *
     * @param list list of Series entities to export
     * @return generated Excel file as byte array
     */
    public static byte[] write(List<Series> list) {

        try (Workbook workbook = new XSSFWorkbook()) {

            // Create sheet
            Sheet sheet = workbook.createSheet("Series");

            // Create header row
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Title");
            header.createCell(1).setCellValue("Seasons");
            header.createCell(2).setCellValue("Rating");
            header.createCell(3).setCellValue("Year");
            header.createCell(4).setCellValue("Finished");
            header.createCell(5).setCellValue("Studio");

            int rowIdx = 1;

            // Populate data rows
            for (Series s : list) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(s.getTitle());
                row.createCell(1).setCellValue(s.getSeasons());
                row.createCell(2).setCellValue(s.getRating());
                row.createCell(3).setCellValue(s.getYear());
                row.createCell(4).setCellValue(s.isFinished());
                row.createCell(5).setCellValue(s.getStudio().getName());
            }

            // Auto-size columns for better readability
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // Write workbook to byte array
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to write Excel report", e);
        }
    }
}

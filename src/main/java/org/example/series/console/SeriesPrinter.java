package org.example.series.console;

import java.util.List;
import org.example.series.core.model.*;

/**
 * Utility class responsible for printing {@link Series}
 * data to the console.
 *
 * Provides different formatting styles:
 * - short (detailed table-like view)
 * - simple (compact view)
 * - single item detailed view
 *
 * This class contains only static methods and
 * acts as presentation helper for console mode.
 */
/**
 * Helper for printing series to the console.
 */
public class SeriesPrinter {

    /**
     * Prints series list in detailed (short) format.
     *
     * Format example:
     * 1) Title | seasons: X | rating: X.X | finished: true/false
     *
     * @param list list of series
     */
    public static void printShortList(List<Series> list) {

        if (list == null || list.isEmpty()) {
            System.out.println("(empty)");
            return;
        }

        int i = 1;

        for (Series s : list) {
            System.out.printf(
                    "%d) %s | seasons: %d | rating: %.1f | finished: %s%n",
                    i++,
                    s.getTitle(),
                    s.getSeasons(),
                    s.getRating(),
                    s.isFinished()
            );
        }
    }

    /**
     * Prints series list in compact format.
     *
     * Format example:
     * - Title (rating)
     *
     * @param list list of series
     */
    public static void printSimpleList(List<Series> list) {

        if (list == null || list.isEmpty()) {
            System.out.println("(empty)");
            return;
        }

        for (Series s : list) {
            System.out.println("- "
                    + s.getTitle()
                    + " ("
                    + s.getRating()
                    + ")");
        }
    }

    /**
     * Prints detailed information about a single series.
     *
     * @param s series instance
     */
    public static void printOne(Series s) {

        if (s == null) {
            System.out.println("(null)");
            return;
        }

        System.out.println("Title    : " + s.getTitle());
        System.out.println("Genre    : " + s.getStudio().getName());
        System.out.println("Seasons  : " + s.getSeasons());
        System.out.println("Rating   : " + s.getRating());
        System.out.println("Year     : " + s.getYear());
        System.out.println("Finished : " + s.isFinished());
    }
}

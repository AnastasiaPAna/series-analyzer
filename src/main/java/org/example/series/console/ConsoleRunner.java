package org.example.series.console;

import org.example.series.core.export.XmlStatisticsWriter;
import org.example.series.core.loader.SeriesLoader;
import org.example.series.core.model.Series;
import org.example.series.core.service.StatisticsService;

import java.nio.file.Path;
import java.util.List;
import java.util.Scanner;

/**
 * Console entry-point for CLI/interative mode (used in local runs).
 */
public class ConsoleRunner {

    private static boolean prettyMode = true;

    public static void run(String[] args) {

        if (args.length >= 2) {

            String folderPath = args[0];
            String attribute = args[1];

            if (args.length >= 3) {
                applyModeArg(args[2]);
            }

            List<Series> seriesList = SeriesLoader.loadFromFolder(folderPath);

            System.out.println("=== Loaded series (" + seriesList.size()
                    + ") | mode: "
                    + (prettyMode ? "PRETTY" : "SIMPLE") + " ===");

            printList(seriesList);

            try {
                var stats = StatisticsService.countByAttribute(seriesList, attribute);

                Path out = Path.of("statistics_by_" + attribute.toLowerCase() + ".xml");
                XmlStatisticsWriter.write(stats, attribute.toLowerCase(), out);

                System.out.println("Saved: " + out.toAbsolutePath());

            } catch (IllegalArgumentException ex) {
                System.out.println(ex.getMessage());
            }

            return;
        }

        List<String> files = List.of(
                "data/01_stranger_things.json",
                "data/02_wednesday.json",
                "data/03_vampire_diaries.json",
                "data/04_the_originals.json",
                "data/05_legacies.json",
                "data/06_shield.json",
                "data/07_good_doctor.json",
                "data/08_locke_and_key.json",
                "data/09_game_of_thrones.json"
        );

        List<Series> seriesList = SeriesLoader.loadAll(files);

        System.out.println("=== Series app started! Loaded: "
                + seriesList.size() + " ===");

        try (Scanner sc = new Scanner(System.in)) {

            boolean running = true;

            while (running) {

                printMenu();
                System.out.print("Choose option: ");
                String input = sc.nextLine().trim();

                switch (input) {

                    case "1" -> {
                        System.out.println("\n=== All series | mode: "
                                + (prettyMode ? "PRETTY" : "SIMPLE") + " ===");
                        printList(seriesList);
                    }

                    case "2" -> {
                        System.out.print("Enter min rating: ");
                        double minRating = readDouble(sc);

                        var filtered =
                                StatisticsService.filterByRating(seriesList, minRating);
                        printList(filtered);
                    }

                    case "3" -> {
                        System.out.print("Finished only? (true/false): ");
                        boolean finished = readBoolean(sc);

                        var filtered =
                                StatisticsService.filterByFinished(seriesList, finished);
                        printList(filtered);
                    }

                    case "4" -> {
                        System.out.print("Enter N for TOP by rating: ");
                        int n = readInt(sc);

                        var top =
                                StatisticsService.topNByRating(seriesList, n);
                        printList(top);
                    }

                    case "5" -> {
                        System.out.print("Enter keyword: ");
                        String keyword = sc.nextLine();

                        List<Series> found =
                                StatisticsService.findByTitleContains(seriesList, keyword);

                        if (found.isEmpty()) {
                            System.out.println("Not found");
                        } else {
                            SeriesPrinter.printOne(found.get(0));
                        }
                    }

                    case "6" -> {
                        var sorted =
                                StatisticsService.sortByRatingDesc(seriesList);
                        printList(sorted);
                    }

                    case "7" -> {
                        double avg =
                                StatisticsService.averageRating(seriesList);
                        System.out.printf("Average rating = %.2f%n", avg);

                        int max =
                                StatisticsService.maxSeasons(seriesList);

                        StatisticsService.sortByRatingDesc(seriesList).stream()
                                .filter(s -> s.getSeasons() == max)
                                .findFirst()
                                .ifPresent(s ->
                                        System.out.println("Most seasons: "
                                                + s.getTitle()
                                                + " (" + s.getSeasons() + ")")
                                );
                    }

                    case "8" -> {
                        System.out.print("Enter attribute: ");
                        String attr = sc.nextLine().trim();

                        try {
                            var stats =
                                    StatisticsService.countByAttribute(seriesList, attr);

                            stats.forEach((k, v) ->
                                    System.out.println(k + " = " + v));

                            var out = Path.of("statistics_by_" + attr.toLowerCase() + ".xml");
                            XmlStatisticsWriter.write(stats, attr.toLowerCase(), out);

                            System.out.println("Saved: " + out.toAbsolutePath());

                        } catch (IllegalArgumentException ex) {
                            System.out.println(ex.getMessage());
                        }
                    }

                    case "9" -> {
                        System.out.println("1 - SIMPLE");
                        System.out.println("2 - PRETTY");
                        System.out.print("Enter 1 or 2: ");

                        String mode = sc.nextLine().trim();

                        if (mode.equals("1")) {
                            prettyMode = false;
                            System.out.println("Mode set to SIMPLE");
                        } else if (mode.equals("2")) {
                            prettyMode = true;
                            System.out.println("Mode set to PRETTY");
                        } else {
                            System.out.println("Invalid choice");
                        }
                    }

                    case "0" -> {
                        System.out.println("Bye!");
                        running = false;
                    }

                    default -> System.out.println("Unknown option");
                }

                System.out.println();
            }
        }
    }

    private static void printList(List<Series> list) {
        if (prettyMode) {
            SeriesPrinter.printShortList(list);
        } else {
            SeriesPrinter.printSimpleList(list);
        }
    }

    private static void applyModeArg(String modeArg) {
        if (modeArg == null) return;
        if (modeArg.equalsIgnoreCase("simple")) prettyMode = false;
        if (modeArg.equalsIgnoreCase("pretty")) prettyMode = true;
    }

    private static void printMenu() {
        System.out.println("""
                -------------------------
                1 - Show all series
                2 - Filter by min rating
                3 - Filter by finished
                4 - TOP N by rating
                5 - Search by title
                6 - Sort by rating DESC
                7 - Statistics
                8 - Export statistics to XML
                9 - Change display mode
                0 - Exit
                -------------------------
                """);
    }

    private static int readInt(Scanner sc) {
        while (true) {
            try {
                return Integer.parseInt(sc.nextLine().trim());
            } catch (Exception e) {
                System.out.print("Please enter an integer: ");
            }
        }
    }

    private static double readDouble(Scanner sc) {
        while (true) {
            try {
                return Double.parseDouble(
                        sc.nextLine().trim().replace(",", "."));
            } catch (Exception e) {
                System.out.print("Please enter a number: ");
            }
        }
    }

    private static boolean readBoolean(Scanner sc) {
        while (true) {
            String s = sc.nextLine().trim().toLowerCase();
            if (s.equals("true")) return true;
            if (s.equals("false")) return false;
            System.out.print("Please enter true or false: ");
        }
    }
}

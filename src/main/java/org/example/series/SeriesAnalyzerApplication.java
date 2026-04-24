package org.example.series;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.example.series.console.ConsoleRunner;

import java.util.Map;

/**
 * Main entry point of the application.
 *
 * Supported environment variables:
 *
 * APP_MODE   = console | web
 * APP_DEBUG  = true | false
 * APP_PORT   = 8080 (optional)
 *
 * Default mode = web
 */
/**
 * Main Spring Boot application entry point.
 */
@SpringBootApplication
public class SeriesAnalyzerApplication {

    public static void main(String[] args) {

        // =========================
        // Load .env file (if exists)
        // =========================
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Copy .env variables into JVM system properties
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        // =========================
        // Read configuration
        // =========================
        String mode = System.getProperty("APP_MODE", "web");
        String debugEnv = System.getProperty("APP_DEBUG", "false");
        String port = System.getProperty("APP_PORT");

        boolean debug = "true".equalsIgnoreCase(debugEnv);

        if (debug) {
            System.out.println("[DEBUG] APP_MODE = " + mode);
            System.out.println("[DEBUG] APP_PORT = " + port);
        }

        // =========================
        // Console mode
        // =========================
        if ("console".equalsIgnoreCase(mode)) {

            if (debug) {
                System.out.println("[DEBUG] Starting in CONSOLE mode");
            }

            ConsoleRunner.run(args);
            return;
        }

        // =========================
        // Web mode (Spring Boot)
        // =========================

        if (debug) {
            System.out.println("[DEBUG] Starting in WEB mode");
        }

        SpringApplication app =
                new SpringApplication(SeriesAnalyzerApplication.class);

        // Set custom port if provided
        if (port != null && !port.isBlank()) {
            app.setDefaultProperties(
                    Map.of("server.port", port)
            );
        }

        app.run(args);
    }
}

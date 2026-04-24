package org.example.series.api.exception;

/**
 * Exception thrown on data conflicts such as unique constraint violations.
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
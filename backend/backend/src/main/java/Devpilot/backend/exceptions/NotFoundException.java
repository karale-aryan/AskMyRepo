package Devpilot.backend.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import lombok.Getter;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {
    @Getter
    private final String field;

    public NotFoundException(String message) {
        this(message, null);
    }

    public NotFoundException(String message, String field) {
        super(message);
        this.field = field;
    }
}

package Devpilot.backend.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import lombok.Getter;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
    @Getter
    private final String field;

    public UnauthorizedException(String message) {
        this(message, null);
    }

    public UnauthorizedException(String message, String field) {
        super(message);
        this.field = field;
    }
}

package Devpilot.backend.exceptions;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.Setter;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    @Getter
    @Setter
    private final String field;

    public BadRequestException(String message, String field) {
        super(message);
        this.field = field;
    }
}
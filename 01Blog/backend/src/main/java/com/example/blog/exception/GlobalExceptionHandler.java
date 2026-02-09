package com.example.blog.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1️⃣ Erreurs de validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(error ->
              errors.put(error.getField(), error.getDefaultMessage())
          );

        return ResponseEntity.badRequest().body(errors);
    }

    // 2️⃣ TOUTES les autres exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {

        Map<String, String> error = new HashMap<>();
        error.put("message", "Erreur interne du serveur");
        error.put("details", ex.getMessage());

        return ResponseEntity.status(500).body(error);
    }
}

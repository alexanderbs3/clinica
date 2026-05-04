package br.leetjourney.msauth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * FIX #1 — Causa raiz do erro no cadastro de profissional:
 *
 * O ms-auth NÃO POSSUÍA um GlobalExceptionHandler.
 *
 * Quando o admin tenta cadastrar um profissional com username já existente,
 * o AuthService.registrar() lança uma RuntimeException("Username já existe: ...").
 * Sem este handler, o Spring Boot usa seu DefaultErrorAttributes, que devolve:
 *
 *   { "timestamp": "...", "status": 500, "error": "Internal Server Error", "path": "..." }
 *
 * Problemas gerados:
 *   1. HTTP 500 em vez de 400 — semanticamente errado (é um erro de negócio, não de servidor).
 *   2. Não há campo "message" no corpo — o frontend fazia e?.error?.message → undefined,
 *      caindo sempre no fallback genérico "Erro ao cadastrar profissional.".
 *   3. Erros de validação @Valid também viravam 500 sem detalhe dos campos inválidos.
 *
 * Este handler adota o mesmo formato já usado em ms-cadastro e ms-atendimento,
 * garantindo consistência em todo o sistema:
 *   { "timestamp": "...", "status": 4xx, "error": "<mensagem>" }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Erros de negócio — ex: username duplicado, credenciais inválidas.
     * Retorna 400 Bad Request com a mensagem da exceção.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status",    400,
                "error",     ex.getMessage() != null ? ex.getMessage() : "Erro inesperado"
        ));
    }

    /**
     * Erros de validação de campos (@Valid / @NotBlank / @NotNull).
     * Retorna 400 com a lista de campos inválidos concatenada.
     * Ex: "username: não pode estar em branco; password: não pode estar em branco"
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String fields = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "timestamp", LocalDateTime.now(),
                "status",    400,
                "error",     fields.isBlank() ? "Dados inválidos" : fields
        ));
    }
}
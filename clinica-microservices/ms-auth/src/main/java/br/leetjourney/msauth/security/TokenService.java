package br.leetjourney.msauth.security;

import br.leetjourney.msauth.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {
    @Value("${security.token.secret}") private String secret;
    @Value("${security.token.expiration}") private long expirationMs;
    private static final String ISSUER = "clinica-ms";

    public String gerarToken(Usuario usuario) {
        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(String.valueOf(usuario.getId()))
                .withClaim("username", usuario.getUsername())
                .withClaim("role", usuario.getRole().name())
                .withExpiresAt(Instant.now().plus(expirationMs, ChronoUnit.MILLIS))
                .sign(Algorithm.HMAC256(secret));
    }

    public String validarToken(String token) {
        try {
            var decoded = JWT.require(Algorithm.HMAC256(secret)).withIssuer(ISSUER).build().verify(token);
            return decoded.getClaim("username").asString();
        } catch (JWTVerificationException e) { return null; }
    }
}

package br.leetjourney.apigateway.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Value("${security.token.secret}")
    private String secret;

    private static final String ISSUER = "clinica-ms";

    public DecodedJWT validar(String token) {
        try {
            return JWT.require(Algorithm.HMAC256(secret)).withIssuer(ISSUER).build().verify(token);
        } catch (JWTVerificationException e) {
            return null;
        }
    }
}

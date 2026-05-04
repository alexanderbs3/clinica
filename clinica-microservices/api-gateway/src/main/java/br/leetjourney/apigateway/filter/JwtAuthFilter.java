package br.leetjourney.apigateway.filter;

import br.leetjourney.apigateway.security.JwtUtil;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Filtro JWT do API Gateway.
 * Valida o token, extrai userId e role, e propaga como headers X-User-Id / X-User-Role
 * para os microsserviços downstream — eliminando a necessidade de Spring Security em cada MS.
 */
@Slf4j
@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<Object> {
    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        super(Object.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            var request = exchange.getRequest();
            String authHeader = request.getHeaders().getFirst("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            DecodedJWT jwt = jwtUtil.validar(authHeader.substring(7));
            if (jwt == null) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Propaga identidade como headers internos
            var mutatedRequest = request.mutate()
                    .header("X-User-Id", jwt.getSubject())
                    .header("X-User-Role", jwt.getClaim("role").asString())
                    .header("X-Username", jwt.getClaim("username").asString())
                    .build();

            log.debug("JWT válido — userId={} role={}", jwt.getSubject(),
                    jwt.getClaim("role").asString());

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }
}

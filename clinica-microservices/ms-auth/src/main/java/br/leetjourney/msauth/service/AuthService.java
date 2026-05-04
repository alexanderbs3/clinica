package br.leetjourney.msauth.service;

import br.leetjourney.msauth.dto.LoginRequest;
import br.leetjourney.msauth.dto.LoginResponse;
import br.leetjourney.msauth.dto.RegisterRequest;
import br.leetjourney.msauth.model.Usuario;
import br.leetjourney.msauth.repository.UsuarioRepository;
import br.leetjourney.msauth.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authManager;
    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse autenticar(LoginRequest request) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        var user = (Usuario) auth.getPrincipal();
        return new LoginResponse(tokenService.gerarToken(user));
    }

    public LoginResponse registrar(RegisterRequest request) {
        if (usuarioRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Username já existe: " + request.username());
        }
        var usuario = new Usuario(null, request.username(),
                passwordEncoder.encode(request.password()), request.role());
        var salvo = usuarioRepository.save(usuario);
        return new LoginResponse(tokenService.gerarToken(salvo));
    }
}

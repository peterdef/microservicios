package ec.edu.espe.auth.controller;

import ec.edu.espe.auth.dto.LoginRequest;
import ec.edu.espe.auth.dto.LoginResponse;
import ec.edu.espe.auth.dto.RegisterRequest;
import ec.edu.espe.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(authService.validateToken(token));
    }
}

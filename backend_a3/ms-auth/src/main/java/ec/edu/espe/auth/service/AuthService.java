package ec.edu.espe.auth.service;

import ec.edu.espe.auth.dto.LoginRequest;
import ec.edu.espe.auth.dto.LoginResponse;
import ec.edu.espe.auth.dto.RegisterRequest;
import ec.edu.espe.auth.model.Role;
import ec.edu.espe.auth.model.User;
import ec.edu.espe.auth.repository.RoleRepository;
import ec.edu.espe.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = loadUserByUsername(request.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .username(userDetails.getUsername())
                .roles(userDetails.getAuthorities().stream()
                        .map(Object::toString)
                        .collect(Collectors.toSet()))
                .build();
    }

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            roles = request.getRoles().stream()
                    .map(roleName -> roleRepository.findByName(roleName)
                            .orElseThrow(() -> new RuntimeException("Role not found: " + roleName)))
                    .collect(Collectors.toSet());
        } else {
            // Asignar rol por defecto
            Role defaultRole = roleRepository.findByName(Role.ROLE_LECTOR)
                    .orElseThrow(() -> new RuntimeException("Default role not found"));
            roles.add(defaultRole);
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(roles)
                .build();

        userRepository.save(user);

        UserDetails userDetails = loadUserByUsername(user.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .username(userDetails.getUsername())
                .roles(userDetails.getAuthorities().stream()
                        .map(Object::toString)
                        .collect(Collectors.toSet()))
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        String token = refreshToken.replace("Bearer ", "");
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = loadUserByUsername(username);

        if (jwtService.validateToken(token, userDetails)) {
            String newAccessToken = jwtService.generateToken(userDetails);
            String newRefreshToken = jwtService.generateRefreshToken(userDetails);

            return LoginResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .username(userDetails.getUsername())
                    .roles(userDetails.getAuthorities().stream()
                            .map(Object::toString)
                            .collect(Collectors.toSet()))
                    .build();
        }

        throw new RuntimeException("Invalid refresh token");
    }

    public Boolean validateToken(String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            String username = jwtService.extractUsername(jwt);
            UserDetails userDetails = loadUserByUsername(username);
            return jwtService.validateToken(jwt, userDetails);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(Role::getName)
                        .toArray(String[]::new))
                .build();
    }
}

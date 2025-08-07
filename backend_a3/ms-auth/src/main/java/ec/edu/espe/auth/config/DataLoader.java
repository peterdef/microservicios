package ec.edu.espe.auth.config;

import ec.edu.espe.auth.model.Role;
import ec.edu.espe.auth.model.User;
import ec.edu.espe.auth.repository.RoleRepository;
import ec.edu.espe.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear roles si no existen
        createRolesIfNotExist();
        
        // Crear usuarios por defecto si no existen
        createDefaultUsersIfNotExist();
    }

    private void createRolesIfNotExist() {
        if (roleRepository.count() == 0) {
            Role roleAutor = Role.builder().name(Role.ROLE_AUTOR).build();
            Role roleRevisor = Role.builder().name(Role.ROLE_REVISOR).build();
            Role roleEditor = Role.builder().name(Role.ROLE_EDITOR).build();
            Role roleAdmin = Role.builder().name(Role.ROLE_ADMIN).build();
            Role roleLector = Role.builder().name(Role.ROLE_LECTOR).build();

            roleRepository.save(roleAutor);
            roleRepository.save(roleRevisor);
            roleRepository.save(roleEditor);
            roleRepository.save(roleAdmin);
            roleRepository.save(roleLector);
        }
    }

    private void createDefaultUsersIfNotExist() {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(Role.ROLE_ADMIN).orElseThrow();
            Role autorRole = roleRepository.findByName(Role.ROLE_AUTOR).orElseThrow();
            Role revisorRole = roleRepository.findByName(Role.ROLE_REVISOR).orElseThrow();
            Role editorRole = roleRepository.findByName(Role.ROLE_EDITOR).orElseThrow();
            Role lectorRole = roleRepository.findByName(Role.ROLE_LECTOR).orElseThrow();

            // Usuario administrador
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();

            // Usuario autor
            User autor = User.builder()
                    .username("autor")
                    .password(passwordEncoder.encode("autor123"))
                    .roles(Set.of(autorRole))
                    .build();

            // Usuario revisor
            User revisor = User.builder()
                    .username("revisor")
                    .password(passwordEncoder.encode("revisor123"))
                    .roles(Set.of(revisorRole))
                    .build();

            // Usuario editor
            User editor = User.builder()
                    .username("editor")
                    .password(passwordEncoder.encode("editor123"))
                    .roles(Set.of(editorRole))
                    .build();

            // Usuario lector
            User lector = User.builder()
                    .username("lector")
                    .password(passwordEncoder.encode("lector123"))
                    .roles(Set.of(lectorRole))
                    .build();

            userRepository.save(admin);
            userRepository.save(autor);
            userRepository.save(revisor);
            userRepository.save(editor);
            userRepository.save(lector);
        }
    }
}

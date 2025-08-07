package ec.edu.espe.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    private String name;

    // Roles específicos según requerimientos
    public static final String ROLE_AUTOR = "ROLE_AUTOR";
    public static final String ROLE_REVISOR = "ROLE_REVISOR";
    public static final String ROLE_EDITOR = "ROLE_EDITOR";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
    public static final String ROLE_LECTOR = "ROLE_LECTOR";
}

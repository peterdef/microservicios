package publicaciones.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class AuthClientFallback implements AuthClient {

    @Override
    public Boolean validateToken(String token) {
        log.warn("Auth service unavailable, token validation failed");
        return false;
    }

    @Override
    public UserInfo getUserInfo(String username, String token) {
        log.warn("Auth service unavailable, cannot get user info for: {}", username);
        return null;
    }

    @Override
    public String[] getUserRoles(String userId, String token) {
        log.warn("Auth service unavailable, cannot get roles for user: {}", userId);
        return new String[0];
    }
}


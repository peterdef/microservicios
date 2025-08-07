package publicaciones.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ms-auth", fallback = AuthClientFallback.class)
public interface AuthClient {

    @GetMapping("/auth/validate")
    Boolean validateToken(@RequestHeader("Authorization") String token);

    @GetMapping("/auth/user/{username}")
    UserInfo getUserInfo(@PathVariable String username, @RequestHeader("Authorization") String token);

    @GetMapping("/auth/user/{userId}/roles")
    String[] getUserRoles(@PathVariable String userId, @RequestHeader("Authorization") String token);
}

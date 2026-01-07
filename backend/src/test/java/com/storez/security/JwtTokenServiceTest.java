package com.storez.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenServiceTest {

    @Test
    void generatesAndValidatesToken() {
        JwtTokenService service = new JwtTokenService(
                "test-secret-key-must-be-long-enough-for-hmac-512",
                3600
        );
        service.init();

        User principal = new User("alice@storez.com", "password", List.of(new SimpleGrantedAuthority("USER")));
        String token = service.generateToken(principal);

        assertThat(token).isNotBlank();
        assertThat(service.extractUsername(token)).isEqualTo("alice@storez.com");
        assertThat(service.isTokenValid(token, principal)).isTrue();
    }
}

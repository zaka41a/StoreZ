package com.storez.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class SessionCookieConfig {

    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();

        serializer.setCookieName("SESSION");
        serializer.setSameSite(null); // ✅ autorise le cross-port (localhost:5173 -> localhost:8080)
        serializer.setUseSecureCookie(false); // ✅ obligatoire en HTTP local
        serializer.setDomainNamePattern("^.*localhost$"); // ✅ accepte localhost ET 127.0.0.1
        serializer.setCookiePath("/");
        serializer.setUseHttpOnlyCookie(true);

        return serializer;
    }
}

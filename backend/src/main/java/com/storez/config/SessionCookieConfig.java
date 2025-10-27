// src/main/java/com/storez/config/SessionCookieConfig.java
package com.storez.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

@Configuration
public class SessionCookieConfig {
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer s = new DefaultCookieSerializer();
        s.setCookieName("SESSION");
        s.setSameSite("Lax");   // ✅ important en local
        s.setUseSecureCookie(false); // ✅ en HTTP local
        s.setCookiePath("/");
        s.setUseHttpOnlyCookie(true);
        return s;
    }
}

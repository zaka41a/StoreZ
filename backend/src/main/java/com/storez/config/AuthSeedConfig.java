package com.storez.config;

import com.storez.model.Role;
import com.storez.model.Supplier;
import com.storez.model.SupplierStatus;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AuthSeedConfig {

    private static final Logger log = LoggerFactory.getLogger(AuthSeedConfig.class);

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner defaultAccountsSeeder(UserRepository userRepository,
                                                  SupplierRepository supplierRepository) {
        return args -> {
            upsertUser(userRepository, "admin@storez.com", "Admin StoreZ", "admin123", Role.ADMIN);
            upsertUser(userRepository, "user@storez.com", "Demo Shopper", "user123", Role.USER);
            upsertUser(userRepository, "apple@gmail.com", "Apple Demo", "qwer", Role.USER);
            upsertUser(userRepository, "hamza@gmail.com", "Hamza Talwani", "qwer", Role.USER);
            seedSupplier(supplierRepository, "supplier@storez.com", "Demo Supplier", "supplier123");
        };
    }

    private void upsertUser(UserRepository userRepository,
                            String email,
                            String name,
                            String rawPassword,
                            Role role) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        boolean isNew = user.getId() == null;

        user.setEmail(email);
        if (isNew || user.getName() == null) {
            user.setName(name);
        }
        if (user.getRole() == null) {
            user.setRole(role);
        }
        if (isNew) {
            user.setPhone(user.getPhone() != null ? user.getPhone() : "+1 000 000 0000");
            user.setAddress(user.getAddress() != null ? user.getAddress() : "123 Demo Street");
            user.setCity(user.getCity() != null ? user.getCity() : "Demo City");
            user.setCountry(user.getCountry() != null ? user.getCountry() : "Demo Land");
        }

        String currentHash = user.getPasswordHash();
        if (currentHash == null || !passwordEncoder.matches(rawPassword, currentHash)) {
            user.setPasswordHash(passwordEncoder.encode(rawPassword));
        }

        userRepository.save(user);
        log.info("{} demo account ready: {}", role, email);
    }

    private void seedSupplier(SupplierRepository supplierRepository, String email, String companyName, String rawPassword) {
        supplierRepository.findByEmail(email).ifPresentOrElse(
                existing -> log.debug("Supplier {} already exists, skipping seed", email),
                () -> {
                    Supplier supplier = Supplier.builder()
                            .email(email)
                            .companyName(companyName)
                            .phone("+1 999 999 9999")
                            .address("456 Supplier Road")
                            .description("Demo supplier account for testing")
                            .passwordHash(passwordEncoder.encode(rawPassword))
                            .status(SupplierStatus.APPROVED)
                            .approved(true)
                            .build();
                    supplierRepository.save(supplier);
                    log.info("Seeded supplier account {}", email);
                }
        );
    }
}

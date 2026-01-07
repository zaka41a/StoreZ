package com.storez.controller;

import com.storez.dto.AuthResponse;
import com.storez.dto.LoginRequest;
import com.storez.dto.RegisterSupplierRequest;
import com.storez.dto.RegisterUserRequest;
import com.storez.dto.UserSummaryDto;
import com.storez.model.Role;
import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import com.storez.security.JwtTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final SupplierRepository supplierRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        UserDetails principal = (UserDetails) authentication.getPrincipal();
        String token = jwtTokenService.generateToken(principal);
        UserSummaryDto user = resolveUser(principal.getUsername());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .expiresIn(jwtTokenService.getExpirationSeconds())
                .user(user)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> me(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return ResponseEntity.ok(resolveUser(principal.getUsername()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/register-user")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterUserRequest req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already used");
        }

        User user = User.builder()
                .email(req.getEmail())
                .name(req.getName())
                .passwordHash(encoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .address(req.getAddress())
                .role(Role.USER)
                .build();
        userRepo.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/register-supplier")
    public ResponseEntity<Map<String, String>> registerSupplier(@Valid @RequestBody RegisterSupplierRequest req) {
        if (supplierRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already used");
        }

        Supplier supplier = Supplier.builder()
                .email(req.getEmail())
                .companyName(req.getCompanyName())
                .description(req.getDescription())
                .phone(req.getPhone())
                .address(req.getAddress())
                .passwordHash(encoder.encode(req.getPassword()))
                .build();
        supplierRepo.save(supplier);

        return ResponseEntity.ok(Map.of("message", "Supplier registered successfully"));
    }

    private UserSummaryDto resolveUser(String email) {
        return userRepo.findByEmail(email)
                .map(user -> UserSummaryDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .or(() -> supplierRepo.findByEmail(email).map(supplier -> UserSummaryDto.builder()
                        .id(supplier.getId())
                        .name(supplier.getCompanyName())
                        .email(supplier.getEmail())
                        .role(Role.SUPPLIER.name())
                        .build()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}

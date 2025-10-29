// src/main/java/com/storez/controller/AuthController.java
package com.storez.controller;

import com.storez.dto.LoginRequest;
import com.storez.dto.RegisterSupplierRequest;
import com.storez.dto.RegisterUserRequest;
import com.storez.model.Role;
import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager authManager;
  private final UserRepository userRepo;
  private final SupplierRepository supplierRepo;
  private final PasswordEncoder encoder;

  // ✅ Login utilisateur ou fournisseur (session HTTP)
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
    );

    User user = userRepo.findByEmail(req.getEmail()).orElse(null);
    if (user != null) {
      return ResponseEntity.ok(Map.of(
              "id", user.getId(),
              "name", user.getName(),
              "email", user.getEmail(),
              "role", user.getRole().name()
      ));
    }

    Supplier supplier = supplierRepo.findByEmail(req.getEmail()).orElse(null);
    if (supplier != null) {
      return ResponseEntity.ok(Map.of(
              "id", supplier.getId(),
              "name", supplier.getCompanyName(),
              "email", supplier.getEmail(),
              "role", "SUPPLIER"
      ));
    }

    return ResponseEntity.status(404).body(Map.of("error", "User not found"));
  }

  // ✅ Vérifie la session (user connecté)
  @GetMapping("/me")
  public ResponseEntity<?> me(Principal principal) {
    if (principal == null)
      return ResponseEntity.status(401).body(Map.of("message", "Not logged in"));

    String email = principal.getName();
    return userRepo.findByEmail(email)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .or(() -> supplierRepo.findByEmail(email).map(ResponseEntity::ok))
            .orElse(ResponseEntity.status(404).body(Map.of("message", "User not found")));
  }

  // ✅ Déconnexion (handled by SecurityConfig)
  @PostMapping("/logout")
  public ResponseEntity<?> logout() {
    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
  }

  // ✅ Inscription utilisateur
  @PostMapping("/register-user")
  public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest req) {
    if (userRepo.findByEmail(req.getEmail()).isPresent())
      return ResponseEntity.badRequest().body(Map.of("message", "Email already used"));

    User u = new User();
    u.setEmail(req.getEmail());
    u.setName(req.getName());
    u.setPasswordHash(encoder.encode(req.getPassword()));
    u.setRole(Role.USER);
    userRepo.save(u);

    return ResponseEntity.ok(Map.of("message", "User registered successfully"));
  }

  // ✅ Inscription fournisseur
  @PostMapping("/register-supplier")
  public ResponseEntity<?> registerSupplier(@RequestBody RegisterSupplierRequest req) {
    if (supplierRepo.findByEmail(req.getEmail()).isPresent())
      return ResponseEntity.badRequest().body(Map.of("message", "Email already used"));

    Supplier s = new Supplier();
    s.setEmail(req.getEmail());
    s.setCompanyName(req.getCompanyName());
    s.setDescription(req.getDescription());
    s.setPhone(req.getPhone());
    s.setAddress(req.getAddress());
    s.setPasswordHash(encoder.encode(req.getPassword()));
    supplierRepo.save(s);

    return ResponseEntity.ok(Map.of("message", "Supplier registered successfully"));
  }
}

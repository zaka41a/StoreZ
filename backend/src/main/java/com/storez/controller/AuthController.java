package com.storez.controller;

import com.storez.dto.LoginRequest;
import com.storez.dto.RegisterSupplierRequest;
import com.storez.model.Role;
import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class AuthController {

  private final AuthenticationManager authManager;
  private final UserRepository userRepo;
  private final SupplierRepository supplierRepo;
  private final PasswordEncoder encoder;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest http) {
    Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
    );
    SecurityContextHolder.getContext().setAuthentication(auth);

    HttpSession session = http.getSession(true);
    session.setMaxInactiveInterval(60 * 60 * 4); // 4 heures

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

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    String email = auth.getName();
    User user = userRepo.findByEmail(email).orElse(null);
    if (user != null) {
      return ResponseEntity.ok(Map.of(
              "id", user.getId(),
              "name", user.getName(),
              "email", user.getEmail(),
              "role", user.getRole().name()
      ));
    }

    Supplier supplier = supplierRepo.findByEmail(email).orElse(null);
    if (supplier != null) {
      return ResponseEntity.ok(Map.of(
              "id", supplier.getId(),
              "name", supplier.getCompanyName(),
              "email", supplier.getEmail(),
              "role", "SUPPLIER"
      ));
    }

    return ResponseEntity.status(404).body(Map.of("error", "Account not found"));
  }

  @PostMapping("/register-user")
  public ResponseEntity<?> registerUser(@RequestBody Map<String, String> body) {
    if (userRepo.findByEmail(body.get("email")).isPresent()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email already used"));
    }

    User u = new User();
    u.setName(body.getOrDefault("name", "User"));
    u.setEmail(body.get("email"));
    u.setPasswordHash(encoder.encode(body.get("password")));
    u.setRole(Role.USER);
    u.setPhone(body.get("phone"));
    u.setAddress(body.get("address"));
    userRepo.save(u);

    return ResponseEntity.ok(Map.of("id", u.getId(), "message", "User registered successfully"));
  }

  @PostMapping("/register-supplier")
  public ResponseEntity<?> registerSupplier(@RequestBody RegisterSupplierRequest req) {
    if (supplierRepo.findByEmail(req.getEmail()).isPresent()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email already used"));
    }

    Supplier s = new Supplier();
    s.setCompanyName(req.getCompanyName());
    s.setEmail(req.getEmail());
    s.setPasswordHash(encoder.encode(req.getPassword()));
    s.setPhone(req.getPhone());
    s.setAddress(req.getAddress());
    s.setDescription(req.getDescription());
    s.setApproved(false);

    supplierRepo.save(s);
    return ResponseEntity.ok(Map.of(
            "id", s.getId(),
            "message", "Supplier registered successfully"
    ));
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(HttpServletRequest request) {
    request.getSession().invalidate();
    SecurityContextHolder.clearContext();
    return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
  }
}

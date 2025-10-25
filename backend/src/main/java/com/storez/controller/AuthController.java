package com.storez.controller;

import com.storez.dto.LoginRequest;
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

  // ✅ LOGIN
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest http) {
    Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
    );
    SecurityContextHolder.getContext().setAuthentication(auth);

    HttpSession session = http.getSession(true);
    session.setMaxInactiveInterval(60 * 60 * 4); // 4 heures

    User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().name()
    ));
  }

  // ✅ ME
  @GetMapping("/me")
  public ResponseEntity<?> me() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
      return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }

    User user = userRepo.findByEmail(auth.getName()).orElse(null);
    if (user == null) {
      return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }

    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole().name()
    ));
  }

  // ✅ REGISTER USER
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

  // ✅ REGISTER SUPPLIER
  @PostMapping("/register-supplier")
  public ResponseEntity<?> registerSupplier(@RequestBody Map<String, String> body) {
    if (supplierRepo.findByEmail(body.get("email")).isPresent()) {
      return ResponseEntity.badRequest().body(Map.of("message", "Email already used"));
    }

    Supplier s = new Supplier();
    s.setCompanyName(body.get("companyName"));
    s.setEmail(body.get("email"));
    s.setPasswordHash(encoder.encode(body.get("password")));
    s.setPhone(body.get("phone"));
    s.setAddress(body.get("address"));
    s.setDescription(body.get("description"));
    s.setApproved(false);

    supplierRepo.save(s);
    return ResponseEntity.ok(Map.of(
            "id", s.getId(),
            "message", "Supplier registered successfully"
    ));
  }

}

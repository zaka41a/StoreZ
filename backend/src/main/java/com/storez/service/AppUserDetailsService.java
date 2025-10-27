package com.storez.service;

import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final UserRepository userRepo;
  private final SupplierRepository supplierRepo;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // ✅ 1. Chercher dans USERS
    User u = userRepo.findByEmail(email).orElse(null);
    if (u != null) {
      return org.springframework.security.core.userdetails.User.builder()
              .username(u.getEmail())
              .password(u.getPasswordHash()) // ou getPassword() selon ton modèle
              .roles(u.getRole().name()) // ADMIN / USER
              .build();
    }

    // ✅ 2. Chercher dans SUPPLIER
    Supplier s = supplierRepo.findByEmail(email).orElse(null);
    if (s != null) {
      if (!Boolean.TRUE.equals(s.getApproved())) {
        throw new DisabledException("Supplier not approved yet");
      }

      return org.springframework.security.core.userdetails.User.builder()
              .username(s.getEmail())
              .password(s.getPasswordHash()) // doit être BCrypt !
              .roles("SUPPLIER")
              .build();
    }

    // ❌ Aucun trouvé
    throw new UsernameNotFoundException("No user found with email: " + email);
  }
}

// src/main/java/com/storez/service/AppUserDetailsService.java
package com.storez.service;

import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final UserRepository userRepository;
  private final SupplierRepository supplierRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(email).orElse(null);
    if (user != null) {
      return org.springframework.security.core.userdetails.User
              .builder()
              .username(user.getEmail())
              .password(user.getPasswordHash())
              // 🟢 Correction ici :
              .authorities(user.getRole().name())
              .build();
    }

    Supplier supplier = supplierRepository.findByEmail(email).orElse(null);
    if (supplier != null) {
      return org.springframework.security.core.userdetails.User
              .builder()
              .username(supplier.getEmail())
              .password(supplier.getPasswordHash())
              .authorities("SUPPLIER")
              .build();
    }

    throw new UsernameNotFoundException("User not found: " + email);
  }
}

package com.storez.controller;

import com.storez.model.*;
import com.storez.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/supplier") @RequiredArgsConstructor
@PreAuthorize("hasRole('SUPPLIER')")
public class SupplierController {
  private final UserRepository userRepo;
  private final SupplierRepository supplierRepo;
  private final ProductRepository productRepo;

  private Supplier currentSupplier(Authentication auth) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    return supplierRepo.findAll().stream()
      .filter(s -> s.getOwner()!=null && s.getOwner().getId().equals(u.getId()))
      .findFirst().orElseThrow();
  }

  @GetMapping("/products")
  public List<Product> myProducts(Authentication auth) {
    Supplier s = currentSupplier(auth);
    return productRepo.findBySupplierId(s.getId());
  }

  @PostMapping("/products")
  public Product create(Authentication auth, @RequestBody Map<String,Object> body) {
    Supplier s = currentSupplier(auth);
    Product p = new Product();
    p.setName((String) body.get("name"));
    p.setDescription((String) body.getOrDefault("description",""));
    p.setPrice(Double.parseDouble(String.valueOf(body.getOrDefault("price",0))));
    p.setCategory((String) body.getOrDefault("category","Misc"));
    p.setImage((String) body.getOrDefault("image",""));
    p.setSupplier(s);
    p.setStatus(ProductStatus.PENDING);
    return productRepo.save(p);
  }
}

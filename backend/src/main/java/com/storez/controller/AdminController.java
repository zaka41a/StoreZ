package com.storez.controller;

import com.storez.model.*;
import com.storez.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/admin") @RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
  private final UserRepository userRepo;
  private final SupplierRepository supplierRepo;
  private final ProductRepository productRepo;
  private final OrderRepository orderRepo;

  @GetMapping("/users") public List<User> users() { return userRepo.findAll(); }
  @PatchMapping("/users/{id}/toggle")
  public User toggleUser(@PathVariable Long id) {
    User u = userRepo.findById(id).orElseThrow();
    u.setStatus(u.getStatus()==UserStatus.ACTIVE?UserStatus.INACTIVE:UserStatus.ACTIVE);
    return userRepo.save(u);
  }

  @GetMapping("/suppliers") public List<Supplier> suppliers() { return supplierRepo.findAll(); }
  @GetMapping("/products") public List<Product> products() { return productRepo.findAll(); }
  @GetMapping("/orders") public List<Order> orders() { return orderRepo.findAll(); }

  @GetMapping("/stats")
  public Map<String,Object> stats() {
    double totalSales = orderRepo.findAll().stream()
      .filter(o -> o.getStatus()!=OrderStatus.CANCELLED)
      .mapToDouble(Order::getTotal).sum();
    long approvedSuppliers = supplierRepo.findAll().stream().filter(s -> s.getStatus()==SupplierStatus.APPROVED).count();
    long pendingProducts = productRepo.findAll().stream().filter(p -> p.getStatus()==ProductStatus.PENDING).count();
    return Map.of("totalUsers", userRepo.count(), "totalSuppliers", approvedSuppliers, "totalSales", totalSales, "pendingApprovals", pendingProducts);
  }
}

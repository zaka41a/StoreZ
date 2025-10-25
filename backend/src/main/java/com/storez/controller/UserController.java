package com.storez.controller;

import com.storez.model.*;
import com.storez.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/user") @RequiredArgsConstructor
public class UserController {
  private final UserRepository userRepo;
  private final OrderRepository orderRepo;
  private final ProductRepository productRepo;
  private final CommentRepository commentRepo;

  @GetMapping("/orders")
  public List<Order> myOrders(Authentication auth) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    return orderRepo.findAll().stream().filter(o -> o.getUser().getId().equals(u.getId())).toList();
  }

  @PostMapping("/orders")
  public Order placeOrder(Authentication auth, @RequestBody Map<String,Object> body) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    List<Map<String,Object>> items = (List<Map<String,Object>>) body.get("items");
    Order order = new Order();
    order.setUser(u);
    double total = 0;
    for (Map<String,Object> it : items) {
      Long productId = Long.valueOf(String.valueOf(it.get("productId")));
      int qty = Integer.parseInt(String.valueOf(it.get("qty")));
      Product p = productRepo.findById(productId).orElseThrow();
      OrderItem oi = new OrderItem();
      oi.setProduct(p); oi.setQty(qty); oi.setPriceAtPurchase(p.getPrice());
      order.getItems().add(oi);
      total += p.getPrice() * qty;
    }
    order.setTotal(total);
    return orderRepo.save(order);
  }

  @PostMapping("/products/{id}/comments")
  public ResponseEntity<?> comment(Authentication auth, @PathVariable Long id, @RequestBody Map<String,Object> body) {
    User u = userRepo.findByEmail(auth.getName()).orElseThrow();
    Product p = productRepo.findById(id).orElseThrow();
    Comment c = new Comment();
    c.setProduct(p); c.setUser(u);
    c.setRating(Math.max(1, Math.min(5, Integer.parseInt(String.valueOf(body.getOrDefault("rating",5))))));
    c.setText(String.valueOf(body.getOrDefault("text","")));
    commentRepo.save(c);
    return ResponseEntity.ok(Map.of("id", c.getId()));
  }
}

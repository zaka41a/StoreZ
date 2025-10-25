package com.storez.controller;

import com.storez.model.Product;
import com.storez.model.ProductStatus;
import com.storez.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/public") @RequiredArgsConstructor
public class PublicController {
  private final ProductRepository productRepo;

  @GetMapping("/categories")
  public List<String> categories() { return List.of("Electronics","Books","Fashion","Home"); }

  @GetMapping("/products")
  public Map<String,Object> products(
      @RequestParam(defaultValue = "") String query,
      @RequestParam(required = false) String category,
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "12") int limit
  ) {
    List<Product> all = productRepo.findByStatus(ProductStatus.APPROVED);
    if (!query.isBlank()) {
      String q = query.toLowerCase();
      all = all.stream().filter(p -> p.getName().toLowerCase().contains(q)).toList();
    }
    if (category != null && !category.isBlank()) {
      all = all.stream().filter(p -> category.equals(p.getCategory())).toList();
    }
    int total = all.size();
    int from = Math.max(0, (page-1)*limit);
    int to = Math.min(total, from+limit);
    List<Product> data = from<to ? all.subList(from,to) : List.of();
    return Map.of("data", data, "page", page, "total", total, "pages", (int)Math.ceil(total/(double)limit));
  }

  @GetMapping("/products/{id}")
  public Product product(@PathVariable Long id) { return productRepo.findById(id).orElseThrow(); }
}

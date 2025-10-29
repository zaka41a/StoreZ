package com.storez.controller;

import com.storez.model.Product;
import com.storez.model.ProductStatus;
import com.storez.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;

    @PutMapping("/products/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setStatus(ProductStatus.APPROVED);
        productRepository.save(p);
        return ResponseEntity.ok("Product approved");
    }

    @PutMapping("/products/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        p.setStatus(ProductStatus.REJECTED);
        productRepository.save(p);
        return ResponseEntity.ok("Product rejected");
    }
}

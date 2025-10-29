package com.storez.controller;

import com.storez.model.Product;
import com.storez.model.ProductStatus;
import com.storez.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // ✅ autorise React
public class ProductController {

    private final ProductRepository productRepository;

    /**
     * 🟢 Liste des produits approuvés (filtrage + pagination)
     * Exemple : /api/products?category=Electronics&page=1&limit=12
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllApproved(
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "page", required = false, defaultValue = "0") int page,
            @RequestParam(name = "limit", required = false, defaultValue = "20") int limit) {

        Pageable pageable = PageRequest.of(page, limit);
        List<Product> products;

        if (category != null && !category.isBlank()) {
            products = productRepository.findByStatusAndCategory(ProductStatus.APPROVED, category);
        } else {
            products = productRepository.findByStatus(ProductStatus.APPROVED);
        }

        return ResponseEntity.ok(products);
    }

    /**
     * 🟢 Récupère un produit spécifique par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable("id") Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(product);
    }
}

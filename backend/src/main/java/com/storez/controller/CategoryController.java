package com.storez.controller;

import com.storez.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoryController {

    private final ProductRepository productRepository;

    /**
     * 🟢 Retourne les catégories uniques de produits approuvés
     */
    @GetMapping
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = productRepository.findDistinctCategories();
        return ResponseEntity.ok(categories);
    }
}

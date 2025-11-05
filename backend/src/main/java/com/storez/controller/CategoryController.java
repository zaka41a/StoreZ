package com.storez.controller;

import com.storez.entity.Category;
import com.storez.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = categoryRepository.findAll()
                .stream()
                .map(Category::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }
}

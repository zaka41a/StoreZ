package com.storez.controller;

import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/supplier/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam String category,
            @RequestParam int stock,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {
        if (currentUser == null)
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        String imageUrl = "https://picsum.photos/seed/" + name.replaceAll("\\s+", "_") + "/400";
        if (image != null && !image.isEmpty()) {
            imageUrl = "https://picsum.photos/seed/" + System.currentTimeMillis() + "/400"; // mock upload
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .category(category)
                .image(imageUrl)
                .status("PENDING")
                .supplier(supplier)
                .build();

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product submitted for approval"));
    }
}

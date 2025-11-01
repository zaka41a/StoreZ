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
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    // ✅ 1. Endpoint public - liste de produits visibles par tous avec pagination
    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        List<Product> products = productRepository.findAll();

        // Filtres optionnels
        if (query != null && !query.isEmpty()) {
            products = products.stream()
                    .filter(p -> p.getName().toLowerCase().contains(query.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (category != null && !category.isEmpty()) {
            products = products.stream()
                    .filter(p -> category.equalsIgnoreCase(p.getCategory()))
                    .collect(Collectors.toList());
        }

        // ✅ Convertir en format simplifié avec supplierName
        List<Map<String, Object>> dtoList = products.stream()
                .filter(p -> "APPROVED".equalsIgnoreCase(p.getStatus())) // afficher uniquement approuvés
                .map(p -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", p.getId());
                    dto.put("name", p.getName());
                    dto.put("description", p.getDescription());
                    dto.put("price", p.getPrice());
                    dto.put("image", p.getImage());
                    dto.put("category", p.getCategory());
                    dto.put("stock", p.getStock());
                    dto.put("status", p.getStatus());
                    dto.put("supplierName",
                            p.getSupplier() != null ? p.getSupplier().getCompanyName() : "Unknown supplier");
                    return dto;
                })
                .collect(Collectors.toList());

        // Pagination
        int totalItems = dtoList.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, totalItems);

        List<Map<String, Object>> paginatedList = dtoList.subList(
                Math.max(0, startIndex),
                Math.max(0, endIndex)
        );

        Map<String, Object> response = new HashMap<>();
        response.put("products", paginatedList);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("totalItems", totalItems);
        response.put("itemsPerPage", size);

        return ResponseEntity.ok(response);
    }

    // ✅ 2. Endpoint public - produit unique (détails)
    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Map<String, Object> dto = new HashMap<>();
        dto.put("id", p.getId());
        dto.put("name", p.getName());
        dto.put("description", p.getDescription());
        dto.put("price", p.getPrice());
        dto.put("image", p.getImage());
        dto.put("category", p.getCategory());
        dto.put("stock", p.getStock());
        dto.put("status", p.getStatus());
        dto.put("supplierName",
                p.getSupplier() != null ? p.getSupplier().getCompanyName() : "Unknown supplier");

        return ResponseEntity.ok(dto);
    }

    // ✅ 3. Endpoint supplier - ajout de produit
    // REMOVED: Duplicate endpoint - now handled by SupplierController with proper file upload
    // @PostMapping(value = "/supplier/products", consumes = {"multipart/form-data"})

    // ✅ 4. Endpoint supplier - liste de ses produits
    @GetMapping("/supplier/products")
    public ResponseEntity<?> getMyProducts(@AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser == null)
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List<Product> products = productRepository.findBySupplierId(supplier.getId());
        return ResponseEntity.ok(products);
    }
}

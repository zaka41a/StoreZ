package com.storez.controller;

import com.storez.model.*;
import com.storez.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class ProductController {

    private final ProductRepository productRepo;
    private final SupplierRepository supplierRepo;
    private final CategoryRepository categoryRepo;

    // ✅ 1. Liste publique (affiche seulement les produits approuvés)
    @GetMapping
    public List<Product> list(@RequestParam(defaultValue = "") String query) {
        return productRepo.searchApproved(query);
    }

    // ✅ 2. Détail d’un produit
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return productRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ 3. Supplier ajoute un produit (en attente d’approbation)
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body, Authentication auth) {
        String email = auth.getName();
        var supplier = supplierRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product p = new Product();
        p.setName((String) body.get("name"));
        p.setDescription((String) body.get("description"));
        p.setPrice(Double.valueOf(body.get("price").toString()));
        p.setImage((String) body.get("image"));
        p.setStock(Integer.valueOf(body.get("stock").toString()));
        p.setStatus(ProductStatus.PENDING);
        p.setApproved(false);

        Long catId = Long.valueOf(body.get("categoryId").toString());
        p.setCategory(categoryRepo.findById(catId).orElseThrow());
        p.setSupplier(supplier);

        productRepo.save(p);
        return ResponseEntity.ok(Map.of("message", "Product submitted for approval"));
    }

    // ✅ 4. Admin approuve ou rejette un produit
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        var p = productRepo.findById(id).orElseThrow();
        p.setStatus(ProductStatus.APPROVED);
        p.setApproved(true);
        productRepo.save(p);
        return ResponseEntity.ok(Map.of("message", "Product approved"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        var p = productRepo.findById(id).orElseThrow();
        p.setStatus(ProductStatus.REJECTED);
        p.setApproved(false);
        productRepo.save(p);
        return ResponseEntity.ok(Map.of("message", "Product rejected"));
    }

    // ✅ 5. Supplier voit ses propres produits
    @GetMapping("/mine")
    public ResponseEntity<?> myProducts(Authentication auth) {
        String email = auth.getName();
        var supplier = supplierRepo.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(productRepo.findBySupplier_Id(supplier.getId()));
    }
}

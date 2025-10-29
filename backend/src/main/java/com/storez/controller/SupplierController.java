package com.storez.controller;

import com.storez.model.Product;
import com.storez.model.ProductStatus;
import com.storez.model.Supplier;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(@AuthenticationPrincipal UserDetails currentUser,
                                        @RequestBody Product product) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        product.setSupplier(supplier);
        product.setStatus(ProductStatus.PENDING);
        productRepository.save(product);
        return ResponseEntity.ok("Product submitted for approval");
    }

    @GetMapping("/products/mine")
    public List<Product> myProducts(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return productRepository.findBySupplier(supplier);
    }
}

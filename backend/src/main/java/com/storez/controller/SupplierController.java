package com.storez.controller;

import com.storez.model.Order;
import com.storez.model.OrderItem;
import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.OrderRepository;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class SupplierController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;

    @PostMapping("/products")
    public ResponseEntity<?> addProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = Product.builder()
                .name(name)
                .category(category)
                .price(price)
                .stock(stock)
                .description(description)
                .image(image != null ? "/uploads/" + image.getOriginalFilename() : "https://via.placeholder.com/400")
                .supplier(supplier)
                .status("PENDING")
                .build();

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product submitted for approval"));
    }

    @GetMapping("/products/mine")
    public List<Product> myProducts(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        return productRepository.findBySupplierId(supplier.getId());
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that the product belongs to this supplier
        if (!product.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setStock(stock);
        product.setDescription(description);

        if (image != null && !image.isEmpty()) {
            product.setImage("/uploads/" + image.getOriginalFilename());
        }

        // Reset status to PENDING when updated
        product.setStatus("PENDING");

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product updated and resubmitted for approval"));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id) {

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that the product belongs to this supplier
        if (!product.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        productRepository.delete(product);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List<Product> myProducts = productRepository.findBySupplierId(supplier.getId());
        long totalProducts = myProducts.size();
        long pendingProducts = myProducts.stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();

        // Get all orders
        List<Order> allOrders = orderRepository.findAll();

        // Filter orders that contain products from this supplier
        List<Order> supplierOrders = allOrders.stream()
                .filter(order -> order.getItems() != null && order.getItems().stream()
                        .anyMatch(item -> item.getProduct() != null &&
                                item.getProduct().getSupplier() != null &&
                                item.getProduct().getSupplier().getId().equals(supplier.getId())))
                .collect(Collectors.toList());

        long totalOrders = supplierOrders.size();

        // Calculate total earnings
        double totalEarnings = supplierOrders.stream()
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getProduct() != null &&
                        item.getProduct().getSupplier() != null &&
                        item.getProduct().getSupplier().getId().equals(supplier.getId()))
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Get recent orders (last 5)
        List<Map<String, Object>> recentOrders = supplierOrders.stream()
                .limit(5)
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("id", order.getId());
                    orderMap.put("date", order.getCreatedAt());
                    orderMap.put("status", order.getStatus());

                    // Calculate total for this order (only for this supplier's products)
                    double orderTotal = order.getItems().stream()
                            .filter(item -> item.getProduct() != null &&
                                    item.getProduct().getSupplier() != null &&
                                    item.getProduct().getSupplier().getId().equals(supplier.getId()))
                            .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                            .sum();
                    orderMap.put("total", orderTotal);

                    return orderMap;
                })
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalEarnings", totalEarnings);
        stats.put("pendingProducts", pendingProducts);
        stats.put("recentOrders", recentOrders);

        return ResponseEntity.ok(stats);
    }
}

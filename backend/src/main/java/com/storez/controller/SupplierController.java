package com.storez.controller;

import com.storez.model.Order;
import com.storez.model.OrderItem;
import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.OrderRepository;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import com.storez.service.FileStorageService;
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
    private final FileStorageService fileStorageService;

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

        // Store the image file and get the path
        String imagePath = fileStorageService.storeFile(image);
        if (imagePath == null) {
            imagePath = "https://via.placeholder.com/400";
        }

        Product product = Product.builder()
                .name(name)
                .category(category)
                .price(price)
                .stock(stock)
                .description(description)
                .image(imagePath)
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

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Verify that this product belongs to the current supplier
        if (!product.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to view this product"));
        }

        return ResponseEntity.ok(product);
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
            // Delete old image if exists
            if (product.getImage() != null && product.getImage().startsWith("/uploads/")) {
                fileStorageService.deleteFile(product.getImage());
            }
            // Store new image
            String imagePath = fileStorageService.storeFile(image);
            if (imagePath != null) {
                product.setImage(imagePath);
            }
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

        // Delete image file if exists
        if (product.getImage() != null && product.getImage().startsWith("/uploads/")) {
            fileStorageService.deleteFile(product.getImage());
        }

        productRepository.delete(product);
        return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", supplier.getId());
        profile.put("companyName", supplier.getCompanyName());
        profile.put("email", supplier.getEmail());
        profile.put("phone", supplier.getPhone());
        profile.put("address", supplier.getAddress());
        profile.put("status", supplier.getStatus() != null ? supplier.getStatus().name() : "PENDING");
        profile.put("approved", supplier.isApproved());

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/earnings")
    public ResponseEntity<Map<String, Object>> getEarnings(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Get all orders
        List<Order> allOrders = orderRepository.findAll();

        // Calculate earnings from orders containing supplier's products
        List<Map<String, Object>> earningDetails = new ArrayList<>();
        double totalEarnings = 0.0;

        for (Order order : allOrders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    if (item.getProduct() != null &&
                        item.getProduct().getSupplier() != null &&
                        item.getProduct().getSupplier().getId().equals(supplier.getId())) {

                        double amount = item.getProduct().getPrice() * item.getQuantity();
                        totalEarnings += amount;

                        Map<String, Object> detail = new HashMap<>();
                        detail.put("id", item.getId());
                        detail.put("orderId", order.getId());
                        detail.put("productName", item.getProduct().getName());
                        detail.put("amount", amount);
                        detail.put("date", order.getCreatedAt());
                        earningDetails.add(detail);
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("total", totalEarnings);
        result.put("details", earningDetails);

        return ResponseEntity.ok(result);
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

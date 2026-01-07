package com.storez.controller;

import com.storez.dto.ProductResponse;
import com.storez.model.Order;
import com.storez.model.OrderItem;
import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.OrderItemRepository;
import com.storez.repository.OrderRepository;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import com.storez.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supplier")
@RequiredArgsConstructor
public class SupplierController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
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

        Supplier supplier = currentSupplier(currentUser);

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
    public List<ProductResponse> myProducts(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = currentSupplier(currentUser);
        return productRepository.findBySupplierId(supplier.getId())
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long id) {
        Supplier supplier = currentSupplier(currentUser);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        // Verify that this product belongs to the current supplier
        if (!product.getSupplier().getId().equals(supplier.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to view this product"));
        }

        return ResponseEntity.ok(ProductResponse.from(product));
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

        Supplier supplier = currentSupplier(currentUser);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

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

        Supplier supplier = currentSupplier(currentUser);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

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
        Supplier supplier = currentSupplier(currentUser);

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
        Supplier supplier = currentSupplier(currentUser);

        List<OrderItem> supplierItems = orderItemRepository.findByProduct_Supplier_Id(supplier.getId());
        double totalEarnings = supplierItems.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        List<Map<String, Object>> earningDetails = supplierItems.stream()
                .map(item -> {
                    Map<String, Object> detail = new HashMap<>();
                    detail.put("id", item.getId());
                    detail.put("orderId", item.getOrder() != null ? item.getOrder().getId() : null);
                    detail.put("productName", item.getProduct().getName());
                    detail.put("amount", item.getProduct().getPrice() * item.getQuantity());
                    detail.put("date", item.getOrder() != null ? item.getOrder().getCreatedAt() : null);
                    return detail;
                })
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("total", totalEarnings);
        result.put("details", earningDetails);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal UserDetails currentUser) {
        Supplier supplier = currentSupplier(currentUser);

        List<Product> myProducts = productRepository.findBySupplierId(supplier.getId());
        long totalProducts = myProducts.size();
        long pendingProducts = myProducts.stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();

        List<Order> supplierOrders = orderRepository.findOrdersBySupplierId(supplier.getId());

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

    private Supplier currentSupplier(UserDetails currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
    }
}

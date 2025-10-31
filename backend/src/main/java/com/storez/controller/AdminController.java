package com.storez.controller;

import com.storez.dto.MonthlySalesDTO;
import com.storez.model.Order;
import com.storez.model.Supplier;
import com.storez.model.User;
import com.storez.repository.OrderRepository;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    // Test endpoint pour vérifier l'authentification
    @GetMapping("/test")
    public ResponseEntity<?> test(@org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of(
                "message", "Admin access OK",
                "user", currentUser.getUsername(),
                "authorities", currentUser.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .collect(java.util.stream.Collectors.toList()),
                "timestamp", System.currentTimeMillis()
        ));
    }

    // Dashboard - Statistiques globales
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalSuppliers = supplierRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        // Produits en attente d'approbation
        long pendingProducts = productRepository.findAll().stream()
                .filter(p -> "PENDING".equals(p.getStatus()))
                .count();

        // Suppliers en attente d'approbation
        long pendingSuppliers = supplierRepository.findAll().stream()
                .filter(s -> !s.isApproved())
                .count();

        // Revenue total (somme de toutes les commandes)
        double totalRevenue = orderRepository.findAll().stream()
                .flatMap(order -> order.getItems().stream())
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        // Revenue du mois en cours
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        double monthRevenue = orderRepository.findAll().stream()
                .filter(order -> order.getCreatedAt().isAfter(startOfMonth))
                .flatMap(order -> order.getItems().stream())
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("totalSuppliers", totalSuppliers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("pendingProducts", pendingProducts);
        stats.put("pendingSuppliers", pendingSuppliers);
        stats.put("totalRevenue", totalRevenue);
        stats.put("monthRevenue", monthRevenue);

        return ResponseEntity.ok(stats);
    }

    // Analytics - Données pour graphiques
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Commandes par statut
        Map<String, Long> ordersByStatus = new HashMap<>();
        orderRepository.findAll().forEach(order -> {
            String status = order.getStatus().toString();
            ordersByStatus.put(status, ordersByStatus.getOrDefault(status, 0L) + 1);
        });

        // Produits par catégorie
        Map<String, Long> productsByCategory = new HashMap<>();
        productRepository.findAll().forEach(product -> {
            String category = product.getCategory();
            productsByCategory.put(category, productsByCategory.getOrDefault(category, 0L) + 1);
        });

        // Top 5 suppliers par nombre de produits
        Map<String, Long> topSuppliers = new HashMap<>();
        supplierRepository.findAll().forEach(supplier -> {
            long productCount = productRepository.findBySupplierId(supplier.getId()).size();
            topSuppliers.put(supplier.getCompanyName(), productCount);
        });

        analytics.put("ordersByStatus", ordersByStatus);
        analytics.put("productsByCategory", productsByCategory);
        analytics.put("topSuppliers", topSuppliers);

        return ResponseEntity.ok(analytics);
    }

    // Users - Liste de tous les utilisateurs
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userDtos = users.stream().map(user -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", user.getId());
            dto.put("name", user.getName());
            dto.put("email", user.getEmail());
            dto.put("role", user.getRole() != null ? user.getRole().name() : "USER");
            dto.put("status", user.getStatus() != null ? user.getStatus().name() : "ACTIVE");
            dto.put("phone", user.getPhone());
            dto.put("address", user.getAddress());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }

    // Suppliers - Liste de tous les fournisseurs
    @GetMapping("/suppliers")
    public ResponseEntity<List<Map<String, Object>>> getAllSuppliers() {
        List<Supplier> suppliers = supplierRepository.findAll();
        List<Map<String, Object>> supplierDtos = suppliers.stream().map(supplier -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", supplier.getId());
            dto.put("companyName", supplier.getCompanyName());
            dto.put("email", supplier.getEmail());
            dto.put("phone", supplier.getPhone());
            dto.put("address", supplier.getAddress());
            dto.put("status", supplier.getStatus() != null ? supplier.getStatus().name() : "PENDING");
            dto.put("approved", supplier.isApproved());
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(supplierDtos);
    }

    // Approuver un supplier
    @PutMapping("/suppliers/{id}/approve")
    public ResponseEntity<?> approveSupplier(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setApproved(true);
        supplier.setStatus(com.storez.model.SupplierStatus.APPROVED);
        supplierRepository.save(supplier);

        return ResponseEntity.ok(Map.of("message", "Supplier approved successfully"));
    }

    // Rejeter un supplier
    @PutMapping("/suppliers/{id}/reject")
    public ResponseEntity<?> rejectSupplier(@PathVariable Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        supplier.setApproved(false);
        supplier.setStatus(com.storez.model.SupplierStatus.REJECTED);
        supplierRepository.save(supplier);

        return ResponseEntity.ok(Map.of("message", "Supplier rejected"));
    }

    // Orders - Liste de toutes les commandes
    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<Map<String, Object>> orderDtos = orders.stream().map(order -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", order.getId());
            dto.put("createdAt", order.getCreatedAt());
            dto.put("status", order.getStatus().name());

            // User info
            if (order.getUser() != null) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", order.getUser().getId());
                userInfo.put("name", order.getUser().getName());
                userInfo.put("email", order.getUser().getEmail());
                dto.put("user", userInfo);
            }

            // Calculate total
            double total = order.getItems().stream()
                    .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                    .sum();
            dto.put("total", total);

            // Items
            List<Map<String, Object>> items = order.getItems().stream().map(item -> {
                Map<String, Object> itemDto = new HashMap<>();
                itemDto.put("id", item.getId());
                itemDto.put("quantity", item.getQuantity());
                Map<String, Object> productInfo = new HashMap<>();
                productInfo.put("id", item.getProduct().getId());
                productInfo.put("name", item.getProduct().getName());
                productInfo.put("price", item.getProduct().getPrice());
                itemDto.put("product", productInfo);
                return itemDto;
            }).collect(java.util.stream.Collectors.toList());
            dto.put("items", items);

            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(orderDtos);
    }

    // Mettre à jour le statut d'une commande
    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            order.setStatus(com.storez.model.OrderStatus.valueOf(status));
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "Order status updated"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status"));
        }
    }

    // Supprimer un utilisateur
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // Supprimer un supplier
    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<?> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        supplierRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Supplier deleted successfully"));
    }

    /**
     * Get monthly sales data for the last 12 months
     * Returns aggregated sales totals grouped by month
     * @return List of MonthlySalesDTO containing month name and total sales
     */
    @GetMapping("/analytics/sales-monthly")
    public ResponseEntity<List<MonthlySalesDTO>> getMonthlySales() {
        // Get all orders
        List<Order> allOrders = orderRepository.findAll();

        // Calculate the date 12 months ago
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(12);

        // Filter orders from the last 12 months and group by month
        Map<String, Double> salesByMonth = allOrders.stream()
                .filter(order -> order.getCreatedAt().isAfter(twelveMonthsAgo))
                .collect(Collectors.groupingBy(
                        order -> {
                            // Format as "MMM" (e.g., "Jan", "Feb")
                            return order.getCreatedAt().getMonth()
                                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                        },
                        Collectors.summingDouble(order ->
                            // Calculate order total: sum of (quantity * price) for all items
                            order.getItems().stream()
                                    .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice())
                                    .sum()
                        )
                ));

        // Create a list of the last 12 months in chronological order
        List<MonthlySalesDTO> monthlySales = new ArrayList<>();
        LocalDateTime currentMonth = LocalDateTime.now();

        for (int i = 11; i >= 0; i--) {
            LocalDateTime monthDate = currentMonth.minusMonths(i);
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            double total = salesByMonth.getOrDefault(monthName, 0.0);
            monthlySales.add(new MonthlySalesDTO(monthName, total));
        }

        return ResponseEntity.ok(monthlySales);
    }
}

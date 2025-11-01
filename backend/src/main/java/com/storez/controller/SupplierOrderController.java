package com.storez.controller;

import com.storez.model.Order;
import com.storez.model.OrderItem;
import com.storez.repository.OrderRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/supplier/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class SupplierOrderController {

    private final OrderRepository orderRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<?> getSupplierOrders(@AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser == null)
            return ResponseEntity.status(401).body("Unauthorized");

        var supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        // Get all orders and filter those containing supplier's products
        List<Order> allOrders = orderRepository.findAll();

        List<Map<String, Object>> supplierOrders = allOrders.stream()
                .filter(order -> order.getItems() != null && order.getItems().stream()
                        .anyMatch(item -> item.getProduct() != null &&
                                item.getProduct().getSupplier() != null &&
                                item.getProduct().getSupplier().getId().equals(supplier.getId())))
                .map(order -> {
                    Map<String, Object> orderDto = new HashMap<>();
                    orderDto.put("id", order.getId());
                    orderDto.put("createdAt", order.getCreatedAt());
                    orderDto.put("status", order.getStatus().name());

                    // Filter items to only include this supplier's products
                    List<Map<String, Object>> supplierItems = order.getItems().stream()
                            .filter(item -> item.getProduct() != null &&
                                    item.getProduct().getSupplier() != null &&
                                    item.getProduct().getSupplier().getId().equals(supplier.getId()))
                            .map(item -> {
                                Map<String, Object> itemDto = new HashMap<>();
                                itemDto.put("id", item.getId());
                                itemDto.put("quantity", item.getQuantity());

                                Map<String, Object> productInfo = new HashMap<>();
                                productInfo.put("id", item.getProduct().getId());
                                productInfo.put("name", item.getProduct().getName());
                                productInfo.put("price", item.getProduct().getPrice());
                                productInfo.put("image", item.getProduct().getImage());
                                itemDto.put("product", productInfo);

                                return itemDto;
                            })
                            .collect(Collectors.toList());

                    orderDto.put("items", supplierItems);

                    // Calculate total for this supplier's items only
                    double total = supplierItems.stream()
                            .mapToDouble(item -> {
                                @SuppressWarnings("unchecked")
                                Map<String, Object> product = (Map<String, Object>) item.get("product");
                                double price = ((Number) product.get("price")).doubleValue();
                                int quantity = ((Number) item.get("quantity")).intValue();
                                return price * quantity;
                            })
                            .sum();
                    orderDto.put("total", total);

                    // User info
                    if (order.getUser() != null) {
                        Map<String, Object> userInfo = new HashMap<>();
                        userInfo.put("id", order.getUser().getId());
                        userInfo.put("name", order.getUser().getName());
                        userInfo.put("email", order.getUser().getEmail());
                        orderDto.put("user", userInfo);
                    }

                    return orderDto;
                })
                .sorted((o1, o2) -> ((java.time.LocalDateTime)o2.get("createdAt"))
                        .compareTo((java.time.LocalDateTime)o1.get("createdAt")))
                .collect(Collectors.toList());

        return ResponseEntity.ok(supplierOrders);
    }
}

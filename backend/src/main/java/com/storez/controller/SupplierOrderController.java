package com.storez.controller;

import com.storez.model.OrderItem;
import com.storez.repository.OrderItemRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplier/orders")
@RequiredArgsConstructor
public class SupplierOrderController {

    private final OrderItemRepository orderItemRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping
    public ResponseEntity<?> getSupplierOrders(@AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser == null)
            return ResponseEntity.status(401).body("Unauthorized");

        var supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        List<OrderItem> items = orderItemRepository.findByProduct_Supplier_Id(supplier.getId());
        return ResponseEntity.ok(items);
    }
}

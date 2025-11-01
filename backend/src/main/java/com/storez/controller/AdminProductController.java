package com.storez.controller;

import com.storez.model.OrderItem;
import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.OrderItemRepository;
import com.storez.repository.ProductRepository;
import com.storez.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        int safeSize = Math.max(size, 1);
        int requestedPage = Math.max(page, 1);

        List<Product> allProducts = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        int totalItems = allProducts.size();
        int calculatedTotalPages = totalItems == 0 ? 0 : (int) Math.ceil((double) totalItems / safeSize);
        int effectiveTotalPages = Math.max(calculatedTotalPages, 1);
        int effectivePage = Math.min(requestedPage, effectiveTotalPages);

        int startIndex = (effectivePage - 1) * safeSize;
        int endIndex = Math.min(startIndex + safeSize, totalItems);

        List<Product> pageContent = totalItems == 0
                ? Collections.emptyList()
                : allProducts.subList(startIndex, endIndex);

        List<Map<String, Object>> productDtos = pageContent.stream()
                .map(product -> {
                    Map<String, Object> dto = new HashMap<>();
                    dto.put("id", product.getId());
                    dto.put("name", product.getName());
                    dto.put("description", product.getDescription());
                    dto.put("price", product.getPrice());
                    dto.put("image", product.getImage());
                    dto.put("category", product.getCategory());
                    dto.put("stock", product.getStock());
                    dto.put("status", product.getStatus());

                    Supplier supplier = product.getSupplier();
                    if (supplier != null) {
                        Map<String, Object> supplierInfo = new HashMap<>();
                        supplierInfo.put("id", supplier.getId());
                        supplierInfo.put("companyName", supplier.getCompanyName());
                        supplierInfo.put("email", supplier.getEmail());
                        dto.put("supplier", supplierInfo);
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("products", productDtos);
        response.put("currentPage", effectivePage);
        response.put("totalPages", calculatedTotalPages == 0 ? 1 : calculatedTotalPages);
        response.put("totalItems", totalItems);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus("APPROVED");
        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product approved"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus("REJECTED");
        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product rejected"));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        List<OrderItem> relatedItems = orderItemRepository.findByProductId(id);
        relatedItems.forEach(item -> item.setProduct(null));
        if (!relatedItems.isEmpty()) {
            orderItemRepository.saveAll(relatedItems);
        }

        // Delete image file if exists
        if (product.getImage() != null && product.getImage().startsWith("/uploads/")) {
            fileStorageService.deleteFile(product.getImage());
        }

        productRepository.delete(product);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }
}

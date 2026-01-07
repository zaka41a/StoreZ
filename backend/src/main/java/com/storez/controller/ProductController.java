package com.storez.controller;

import com.storez.dto.PagedResponse;
import com.storez.dto.ProductResponse;
import com.storez.model.Product;
import com.storez.model.Supplier;
import com.storez.repository.ProductRepository;
import com.storez.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @GetMapping("/products")
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        int safePage = Math.max(page - 1, 0);

        String normalizedQuery = normalize(query);
        String normalizedCategory = normalize(category);

        // Convert null to empty string to avoid Hibernate bytea type issue
        normalizedQuery = (normalizedQuery == null) ? "" : normalizedQuery;
        normalizedCategory = (normalizedCategory == null) ? "" : normalizedCategory.toLowerCase();

        Page<Product> productPage = productRepository.searchApprovedProducts(
                normalizedQuery,
                normalizedCategory,
                PageRequest.of(safePage, size, Sort.by(Sort.Direction.DESC, "id"))
        );

        List<ProductResponse> items = productPage.getContent()
                .stream()
                .map(ProductResponse::from)
                .toList();

        PagedResponse<ProductResponse> response = PagedResponse.<ProductResponse>builder()
                .items(items)
                .currentPage(page)
                .totalPages(productPage.getTotalPages())
                .totalItems(productPage.getTotalElements())
                .pageSize(size)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return ResponseEntity.ok(ProductResponse.from(product));
    }

    @GetMapping("/supplier/products")
    public ResponseEntity<List<ProductResponse>> getMyProducts(@AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }

        Supplier supplier = supplierRepository.findByEmail(currentUser.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));

        List<ProductResponse> products = productRepository.findBySupplierId(supplier.getId())
                .stream()
                .map(ProductResponse::from)
                .toList();
        return ResponseEntity.ok(products);
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}

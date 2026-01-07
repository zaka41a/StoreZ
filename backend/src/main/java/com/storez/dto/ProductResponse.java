package com.storez.dto;

import com.storez.model.Product;
import com.storez.model.Supplier;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProductResponse {
    Long id;
    String name;
    String description;
    double price;
    String image;
    String category;
    int stock;
    String status;
    Long supplierId;
    String supplierName;

    public static ProductResponse from(Product product) {
        Supplier supplier = product.getSupplier();
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .image(product.getImage())
                .category(product.getCategory())
                .stock(product.getStock())
                .status(product.getStatus())
                .supplierId(supplier != null ? supplier.getId() : null)
                .supplierName(supplier != null ? supplier.getCompanyName() : "Unknown supplier")
                .build();
    }
}

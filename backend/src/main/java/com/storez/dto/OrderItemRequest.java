package com.storez.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemRequest {
    @NotNull
    private Long productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int qty;
}

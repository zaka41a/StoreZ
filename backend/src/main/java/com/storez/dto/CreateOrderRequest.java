package com.storez.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    @Valid
    @NotEmpty
    private List<OrderItemRequest> items;
}

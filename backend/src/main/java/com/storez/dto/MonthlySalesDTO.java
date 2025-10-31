package com.storez.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for monthly sales data
 * Used to return aggregated sales information to the frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySalesDTO {
    private String month;  // e.g., "Jan", "Feb", "Mar"
    private double total;  // Total sales amount for the month
}

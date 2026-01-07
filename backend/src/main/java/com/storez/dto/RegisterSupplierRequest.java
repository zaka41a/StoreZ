package com.storez.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterSupplierRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String companyName;

    @NotBlank
    private String description;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotBlank
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;
}

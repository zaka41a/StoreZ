package com.storez.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterUserRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String name;

    @NotBlank
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;
}

package com.storez.dto;

import lombok.Data;

@Data
public class RegisterSupplierRequest {
    private String email;
    private String companyName;
    private String description;
    private String phone;
    private String address;
    private String password;
}

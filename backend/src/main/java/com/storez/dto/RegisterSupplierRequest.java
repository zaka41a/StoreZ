package com.storez.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterSupplierRequest {
    private String email;
    private String companyName;
    private String phone;
    private String address;
    private String description;
    private String password;
}

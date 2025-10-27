package com.storez.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterSupplierRequest {
    private String companyName;
    private String email;
    private String password;
    private String phone;
    private String address;
    private String description;
}

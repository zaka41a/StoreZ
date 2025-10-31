package com.storez.dto;

import lombok.Data;

@Data
public class RegisterUserRequest {
    private String email;
    private String name;
    private String password;
    private String phone;
    private String address;
}

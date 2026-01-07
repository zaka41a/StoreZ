package com.storez.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    long expiresIn;
    UserSummaryDto user;
}

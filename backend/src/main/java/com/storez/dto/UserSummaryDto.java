package com.storez.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserSummaryDto {
    Long id;
    String name;
    String email;
    String role;
}

package com.storez.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class PagedResponse<T> {
    List<T> items;
    int currentPage;
    int totalPages;
    long totalItems;
    int pageSize;
}

package com.storez.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String description;
  private BigDecimal price;
  private int stock;

  @Enumerated(EnumType.STRING)
  private ProductStatus status = ProductStatus.AVAILABLE;

  @ManyToOne
  @JoinColumn(name = "supplier_id")
  private Supplier supplier;
}

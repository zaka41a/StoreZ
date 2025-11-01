package com.storez.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private int quantity;

  @ManyToOne
  @JoinColumn(name = "product_id")
  @JsonIgnoreProperties({"supplier"})
  private Product product;

  @ManyToOne
  @JoinColumn(name = "order_id")
  @JsonIgnoreProperties({"items", "user"})
  private Order order;
}

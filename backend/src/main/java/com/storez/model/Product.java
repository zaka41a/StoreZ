package com.storez.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String description;
  private double price;
  private String image;
  private String category;
  private int stock;

  @Enumerated(EnumType.STRING)
  private ProductStatus status = ProductStatus.PENDING;

  @ManyToOne
  @JoinColumn(name = "supplier_id")
  private Supplier supplier;
}

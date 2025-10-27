package com.storez.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class Product {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String description;
  private Double price;
  private String image;
  private Integer stock;

  @Enumerated(EnumType.STRING)
  private ProductStatus status = ProductStatus.PENDING; // 🔹 Par défaut en attente

  private boolean approved = false; // 🔹 Optionnel, mais pratique

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToOne
  @JoinColumn(name = "supplier_id")
  private Supplier supplier;
}

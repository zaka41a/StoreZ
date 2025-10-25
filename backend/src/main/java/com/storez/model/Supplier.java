package com.storez.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Supplier {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true)
  private String email;

  private String companyName;
  private String phone;
  private String address;
  private String description;
  private String passwordHash;

  @Enumerated(EnumType.STRING)
  private SupplierStatus status = SupplierStatus.PENDING;

  private boolean approved = false;
}

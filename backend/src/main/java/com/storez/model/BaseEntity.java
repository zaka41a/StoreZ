package com.storez.model;

import jakarta.persistence.*;
import java.time.Instant;

@MappedSuperclass
public abstract class BaseEntity {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  protected Long id;
  protected Instant createdAt;
  protected Instant updatedAt;

  @PrePersist
  public void prePersist() {
    createdAt = Instant.now();
    updatedAt = createdAt;
  }
  @PreUpdate
  public void preUpdate() { updatedAt = Instant.now(); }

  public Long getId() { return id; }
  public Instant getCreatedAt() { return createdAt; }
  public Instant getUpdatedAt() { return updatedAt; }
}

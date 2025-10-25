package com.storez.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.storez.model.Product;
import com.storez.model.ProductStatus;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    List<Product> findBySupplierId(Long supplierId);
}

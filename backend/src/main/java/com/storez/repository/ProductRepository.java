package com.storez.repository;

import com.storez.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(String status);
    List<Product> findBySupplierId(Long supplierId);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.status = 'APPROVED'")
    List<String> findDistinctCategories();
}

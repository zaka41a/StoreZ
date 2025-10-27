package com.storez.repository;

import com.storez.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(com.storez.model.ProductStatus status);

    List<Product> findBySupplier_Id(Long supplierId);

    @Query("SELECT p FROM Product p WHERE p.status = 'APPROVED' AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchApproved(String query);
}

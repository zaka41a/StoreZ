package com.storez.repository;

import com.storez.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(String status);
    List<Product> findBySupplierId(Long supplierId);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.status = 'APPROVED'")
    List<String> findDistinctCategories();

    @Query("""
        SELECT p FROM Product p
        WHERE p.status = 'APPROVED'
        AND (COALESCE(:query, '') = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')))
        AND (COALESCE(:category, '') = '' OR LOWER(p.category) = LOWER(:category))
        """)
    Page<Product> searchApprovedProducts(@Param("query") String query,
                                         @Param("category") String category,
                                         Pageable pageable);
}

package com.storez.repository;

import com.storez.model.Product;
import com.storez.model.ProductStatus;
import com.storez.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    List<Product> findByStatusAndCategory(ProductStatus status, String category);
    List<Product> findBySupplier(Supplier supplier);

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.status = com.storez.model.ProductStatus.APPROVED")
    List<String> findDistinctCategories();
}

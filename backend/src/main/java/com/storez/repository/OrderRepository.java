package com.storez.repository;

import com.storez.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.supplier.id = :supplierId ORDER BY o.createdAt DESC")
    List<Order> findOrdersBySupplierId(@Param("supplierId") Long supplierId);
}

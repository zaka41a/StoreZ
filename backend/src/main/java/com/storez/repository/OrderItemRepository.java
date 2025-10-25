package com.storez.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.storez.model.OrderItem;
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}

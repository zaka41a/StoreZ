package com.storez.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.storez.model.Order;
public interface OrderRepository extends JpaRepository<Order, Long> {

}

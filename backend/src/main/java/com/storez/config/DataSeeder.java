package com.storez.config;

import com.storez.model.*;
import com.storez.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(SupplierRepository supplierRepository, ProductRepository productRepository) {
        return args -> {
            if (supplierRepository.count() == 0) {
                for (int i = 1; i <= 5; i++) {
                    Supplier s = new Supplier();
                    s.setEmail("supplier" + i + "@mail.com");
                    s.setCompanyName("Supplier " + i);
                    s.setPhone("06000000" + i);
                    s.setAddress("Rue du Commerce " + i);
                    s.setDescription("Fournisseur numéro " + i);
                    s.setPasswordHash("demo");
                    s.setStatus(SupplierStatus.APPROVED);
                    s.setApproved(true);
                    supplierRepository.save(s);

                    Product p = new Product();
                    p.setName("Produit " + i);
                    p.setDescription("Description du produit " + i);
                    p.setPrice(BigDecimal.valueOf(19.99 + i));
                    p.setStock(10 * i);
                    p.setStatus(ProductStatus.AVAILABLE);
                    p.setSupplier(s);
                    productRepository.save(p);
                }
            }
        };
    }
}

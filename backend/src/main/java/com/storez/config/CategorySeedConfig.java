package com.storez.config;

import com.storez.entity.Category;
import com.storez.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class CategorySeedConfig {

    private static final Logger log = LoggerFactory.getLogger(CategorySeedConfig.class);

    private static final List<String> DEFAULT_CATEGORIES = List.of(
        "Gym Equipment",
        "Supplements",
        "Athletic Apparel",
        "Smart Wearables",
        "Recovery Tools"
    );

    private final CategoryRepository categoryRepository;

    @Bean
    public CommandLineRunner categorySeeder() {
        return args -> seedCategories();
    }

    @Transactional
    protected void seedCategories() {
        DEFAULT_CATEGORIES.forEach(name -> {
            var duplicates = categoryRepository.findAllByNameIgnoreCase(name);

            if (duplicates.size() > 1) {
                duplicates.stream().skip(1).forEach(duplicate -> {
                    categoryRepository.delete(duplicate);
                    log.warn("Removed duplicated category '{}' with id {}", name, duplicate.getId());
                });
            }

            if (duplicates.isEmpty()) {
                Category category = new Category();
                category.setName(name);
                categoryRepository.save(category);
                log.info("Seeded category '{}'", name);
            }
        });
}
}

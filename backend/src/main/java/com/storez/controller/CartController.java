package com.storez.controller;

import com.storez.model.Cart;
import com.storez.model.CartItem;
import com.storez.model.Product;
import com.storez.model.User;
import com.storez.repository.CartItemRepository;
import com.storez.repository.CartRepository;
import com.storez.repository.ProductRepository;
import com.storez.repository.UserRepository;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Validated
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails currentUser) {
        User user = currentUser(currentUser);

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });

        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal UserDetails currentUser,
            @RequestParam @NotNull Long productId,
            @RequestParam(defaultValue = "1") @Min(1) int quantity) {

        User user = currentUser(currentUser);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });

        // Check if product already in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        return ResponseEntity.ok(Map.of("message", "Product added to cart", "cartSize", cart.getItems().size()));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<?> updateCartItem(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long itemId,
            @RequestParam int quantity) {

        User user = currentUser(currentUser);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        // Verify ownership
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return ResponseEntity.ok(Map.of("message", "Cart updated"));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeFromCart(
            @AuthenticationPrincipal UserDetails currentUser,
            @PathVariable Long itemId) {

        User user = currentUser(currentUser);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

        // Verify ownership
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Access denied"));
        }

        cartItemRepository.delete(item);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserDetails currentUser) {
        User user = currentUser(currentUser);

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        cart.getItems().clear();
        cartRepository.save(cart);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
    private User currentUser(UserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
}

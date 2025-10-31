package com.storez.service;

import com.storez.model.User;
import com.storez.model.UserStatus;
import com.storez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void toggleStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE);
        userRepository.save(user);
    }
}

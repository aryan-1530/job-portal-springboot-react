package com.jobportal2.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal2.dto.UserDTO;
import com.jobportal2.entity.User;
import com.jobportal2.exception.ResourceNotFoundException;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO registerUser(User user) {
        User saved = userRepository.save(user);
        return mapToDTO(saved);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToDTO(user);
    }

    @Override
    public UserDTO updateUser(Long id, User updated) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updated.getName() != null) {
            user.setName(updated.getName());
        }

        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            user.setPassword(updated.getPassword());
        }

        return mapToDTO(userRepository.save(user));
    }

    // ===== ENTITY → DTO =====
    private UserDTO mapToDTO(User u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());   // 🔥 REQUIRED
        dto.setRole(u.getRole());    // 🔥 REQUIRED
        return dto;
    }

}

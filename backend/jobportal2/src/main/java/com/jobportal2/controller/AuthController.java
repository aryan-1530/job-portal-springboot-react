package com.jobportal2.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal2.entity.User;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", "Invalid email"));
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", "Invalid password"));
        }

        // 🚫 BLOCKED USER
        if (!user.isActive()) {
            return ResponseEntity
                    .status(403)
                    .body(Map.of("error", "Your account is blocked by admin"));
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of(
                    "token", token,
                    "role", user.getRole().name(),
                    "userId", user.getId().toString()
                )
        );
    }


}

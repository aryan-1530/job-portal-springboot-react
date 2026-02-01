package com.jobportal2.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal2.dto.UserDTO;
import com.jobportal2.entity.User;
import com.jobportal2.repository.UserRepository;
import com.jobportal2.security.JwtUtil;
import com.jobportal2.service.UserService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private static final String RESUME_DIR = "uploads/resumes/";

    // ================= REGISTER =================
    @PostMapping("/register")
    public UserDTO registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // ================= GET PROFILE =================
    @GetMapping("/{id}")
    public UserDTO getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // ================= UPDATE PROFILE =================
    @PutMapping("/{id}")
    public UserDTO updateUser(
            @PathVariable Long id,
            @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // ================= UPLOAD RESUME (JOB SEEKER) =================
    @PostMapping("/resume")
    public void uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String auth) throws Exception {

        String token = auth.substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Files.createDirectories(Paths.get(RESUME_DIR));

        String fileName = user.getId() + "_" + file.getOriginalFilename();
        Path path = Paths.get(RESUME_DIR + fileName);

        Files.write(path, file.getBytes());

        user.setResumePath(path.toString());
        userRepository.save(user);
    }
}

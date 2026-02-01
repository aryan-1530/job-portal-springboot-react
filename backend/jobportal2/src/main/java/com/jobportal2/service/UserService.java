package com.jobportal2.service;

import com.jobportal2.dto.UserDTO;
import com.jobportal2.entity.User;

public interface UserService {

    UserDTO registerUser(User user);

    UserDTO getUserById(Long id);

    UserDTO updateUser(Long id, User user);
}

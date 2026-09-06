package Devpilot.backend.services;

import java.nio.file.attribute.UserPrincipal;

import org.springframework.stereotype.Service;

import Devpilot.backend.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class Userservice {
    public final UserRepository userRepository;
    public final TestEncryptor tokenEncryptor;

    @Transactional(readOnly = true)
    public User requiredById(UUID id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalStateException("User not found" + id));
    }

    public String decryptAccessToken(User user) {
        return tokenEncryptor.decrypt(user.getAccessToken());
    }
}
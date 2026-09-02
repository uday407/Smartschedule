package com.smartscheduler.controller;

import com.smartscheduler.dto.ApiResponse;
import com.smartscheduler.dto.AuthRequest;
import com.smartscheduler.dto.AuthResponse;
import com.smartscheduler.entity.RefreshToken;
import com.smartscheduler.entity.User;
import com.smartscheduler.repository.UserRepository;
import com.smartscheduler.security.JwtTokenProvider;
import com.smartscheduler.service.AuditService;
import com.smartscheduler.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuditService auditService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        auditService.logAction(user.getUsername(), "USER_LOGIN", "User", user.getId(), "User logged in successfully");

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                refreshToken.getToken(),
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getDepartment(),
                user.getMobile()
        ));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("refreshToken");

        Optional<RefreshToken> tokenOpt = refreshTokenService.findByToken(requestRefreshToken);
        if (tokenOpt.isPresent()) {
            RefreshToken token = refreshTokenService.verifyExpiration(tokenOpt.get());
            User user = token.getUser();
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    user.getUsername(), null, java.util.Collections.emptyList());
            String jwt = tokenProvider.generateToken(auth);
            return ResponseEntity.ok(new AuthResponse(jwt, requestRefreshToken, user.getUsername(),
                    user.getFullName(), user.getRole(), user.getDepartment(), user.getMobile()));
        }

        return ResponseEntity.badRequest().body(new ApiResponse(false, "Refresh token is invalid or expired!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logoutUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username != null) {
            refreshTokenService.deleteByUsername(username);
            auditService.logAction(username, "USER_LOGOUT", "User", null, "User logged out successfully");
        }
        return ResponseEntity.ok(new ApiResponse(true, "User logged out successfully!"));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("PROFESSOR");
        }
        if (user.getImageUrl() == null || user.getImageUrl().isEmpty()) {
            user.setImageUrl("https://ui-avatars.com/api/?name=" + user.getFullName());
        }

        User saved = userRepository.save(user);
        auditService.logAction("ADMIN", "REGISTER_USER", "User", saved.getId(), "Registered new user: " + saved.getUsername() + " (" + saved.getRole() + ")");

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String oldPassword = data.get("oldPassword");
        String newPassword = data.get("newPassword");

        Optional<User> found = userRepository.findByUsername(username);
        if (found.isPresent() && found.get().getPassword().equals(oldPassword)) {
            User u = found.get();
            u.setPassword(newPassword);
            userRepository.save(u);
            auditService.logAction(username, "CHANGE_PASSWORD", "User", u.getId(), "Updated password successfully");
            return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully!"));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(false, "Incorrect current password!"));
    }
}

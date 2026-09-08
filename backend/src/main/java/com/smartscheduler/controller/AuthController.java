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

import com.smartscheduler.dto.VerifyEmailRequest;
import com.smartscheduler.service.EmailService;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
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

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest loginRequest) {
        String cleanUsername = loginRequest.getUsername() != null ? loginRequest.getUsername().trim() : "";
        String cleanPassword = loginRequest.getPassword() != null ? loginRequest.getPassword().trim() : "";

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanUsername, cleanPassword)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameIgnoreCase(cleanUsername).orElseThrow();
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());

        auditService.logAction(user.getUsername(), "USER_LOGIN", "User", user.getId(), "User logged in successfully");

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                refreshToken.getToken(),
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.getDepartment(),
                user.getMobile(),
                user.isEmailVerified()
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
                    user.getFullName(), user.getRole(), user.getDepartment(), user.getMobile(), user.isEmailVerified()));
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

        // Generate 6-digit OTP for Email Verification
        String code = String.format("%06d", new Random().nextInt(900000) + 100000);
        user.setEmailVerified(false);
        user.setVerificationCode(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));

        User saved = userRepository.save(user);
        auditService.logAction("ADMIN", "REGISTER_USER", "User", saved.getId(), "Registered new user: " + saved.getUsername() + " (" + saved.getRole() + ")");

        // Dispatch verification email
        emailService.sendVerificationCode(saved.getUsername(), code);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully! Verification OTP code dispatched to email."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found!"));
        }

        User user = userOpt.get();
        if (user.isEmailVerified()) {
            return ResponseEntity.ok(new ApiResponse(true, "Email is already verified."));
        }

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(request.getCode())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid verification code!"));
        }

        if (user.getVerificationCodeExpiry() != null && user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Verification code has expired! Please request a new code."));
        }

        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

        auditService.logAction(user.getUsername(), "VERIFY_EMAIL", "User", user.getId(), "Email verified successfully");

        return ResponseEntity.ok(new ApiResponse(true, "Email verified successfully!"));
    }

    @PostMapping("/resend-code")
    public ResponseEntity<ApiResponse> resendVerificationCode(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is required!"));
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "User not found!"));
        }

        User user = userOpt.get();
        if (user.isEmailVerified()) {
            return ResponseEntity.ok(new ApiResponse(true, "Email is already verified."));
        }

        String code = String.format("%06d", new Random().nextInt(900000) + 100000);
        user.setVerificationCode(code);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendVerificationCode(user.getUsername(), code);
        auditService.logAction(user.getUsername(), "RESEND_VERIFICATION_CODE", "User", user.getId(), "Resent email verification OTP");

        return ResponseEntity.ok(new ApiResponse(true, "A new 6-digit verification OTP code has been sent to your email."));
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

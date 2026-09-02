package com.smartscheduler;

import com.smartscheduler.controller.AuthController;
import com.smartscheduler.dto.AuthRequest;
import com.smartscheduler.dto.AuthResponse;
import com.smartscheduler.entity.RefreshToken;
import com.smartscheduler.entity.User;
import com.smartscheduler.repository.UserRepository;
import com.smartscheduler.security.JwtTokenProvider;
import com.smartscheduler.service.AuditService;
import com.smartscheduler.service.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditService auditService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthController authController;

    private User sampleUser;
    private RefreshToken sampleRefreshToken;

    @BeforeEach
    public void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setUsername("admin");
        sampleUser.setPassword("admin123");
        sampleUser.setRole("HOD");
        sampleUser.setFullName("Dr. Admin HOD");

        sampleRefreshToken = new RefreshToken();
        sampleRefreshToken.setToken("mocked-refresh-token-uuid");
        sampleRefreshToken.setUser(sampleUser);
    }

    @Test
    public void testLoginSuccess() {
        AuthRequest request = new AuthRequest();
        request.setUsername("admin");
        request.setPassword("admin123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked-jwt-token");
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser));
        when(refreshTokenService.createRefreshToken("admin")).thenReturn(sampleRefreshToken);

        ResponseEntity<AuthResponse> response = authController.login(request);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());

        AuthResponse resBody = response.getBody();
        assertEquals("mocked-jwt-token", resBody.getToken());
        assertEquals("mocked-refresh-token-uuid", resBody.getRefreshToken());
        assertEquals("HOD", resBody.getRole());
        verify(auditService, times(1)).logAction(eq("admin"), eq("USER_LOGIN"), eq("User"), eq(1L), anyString());
    }

    @Test
    public void testLoginUserNotFoundThrowsException() {
        AuthRequest request = new AuthRequest();
        request.setUsername("unknown");
        request.setPassword("password");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> authController.login(request));
    }
}

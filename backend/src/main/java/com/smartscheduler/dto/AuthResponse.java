package com.smartscheduler.dto;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private String role;
    private String department;
    private String mobile;

    public AuthResponse() {}

    public AuthResponse(String token, String username, String fullName, String role, String department, String mobile) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
        this.mobile = mobile;
    }

    public AuthResponse(String token, String refreshToken, String username, String fullName, String role, String department, String mobile) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
        this.mobile = mobile;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }
}

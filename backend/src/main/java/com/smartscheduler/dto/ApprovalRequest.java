package com.smartscheduler.dto;

import jakarta.validation.constraints.NotBlank;

public class ApprovalRequest {
    @NotBlank(message = "Action (APPROVE or REJECT) is required")
    private String action; // "APPROVE", "REJECT"

    private String reason;

    public ApprovalRequest() {}

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

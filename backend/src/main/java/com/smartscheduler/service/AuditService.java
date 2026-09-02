package com.smartscheduler.service;

import com.smartscheduler.entity.AuditLog;
import com.smartscheduler.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String actorUsername, String action, String entityType, Long entityId, String details) {
        AuditLog log = new AuditLog(
                actorUsername != null ? actorUsername : "SYSTEM",
                action,
                entityType,
                entityId,
                details
        );
        auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }
}

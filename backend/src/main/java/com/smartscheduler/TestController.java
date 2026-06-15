package com.smartscheduler;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {
    @GetMapping("/api/heartbeat")
    public String heartbeat() {
        return "💓 Project is ALIVE at /api/heartbeat";
    }
}

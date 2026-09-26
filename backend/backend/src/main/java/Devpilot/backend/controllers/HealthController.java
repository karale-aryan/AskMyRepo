package Devpilot.backend.controllers;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    private final long startTimeMs = System.currentTimeMillis();

    /**
     * Primary health check endpoint for UptimeRobot, Render, and external monitors.
     * Accessible at /api/health and /health without authentication.
     */
    @GetMapping({"/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Devpilot Backend");
        response.put("timestamp", Instant.now().toString());
        response.put("uptimeSeconds", (System.currentTimeMillis() - startTimeMs) / 1000);
        response.put("jvmUptimeMs", ManagementFactory.getRuntimeMXBean().getUptime());
        return ResponseEntity.ok(response);
    }

    /**
     * Ultra-fast ping endpoint returning simple 200 OK text response.
     * Ideal for minimal latency keep-alive pings.
     */
    @GetMapping({"/ping", "/api/ping"})
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}

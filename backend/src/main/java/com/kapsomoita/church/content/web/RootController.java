package com.kapsomoita.church.content.web;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Root status endpoint for browser and operational health checks. */
@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
                "name", "Kapsomoita AGC API",
                "status", "RUNNING",
                "message", "Welcome to Kapsomoita AGC API. Endpoints are available under /api."
        );
    }
}

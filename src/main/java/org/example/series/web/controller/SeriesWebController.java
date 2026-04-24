package org.example.series.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the standalone SPA frontend for block 3 while keeping block 4 integration available.
 */
@Controller
public class SeriesWebController {

    @GetMapping({"/", "/series", "/top", "/statistics"})
    public String spa() {
        return "forward:/spa/index.html";
    }
}

package org.example.series.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SeriesWebController {

    @GetMapping("/")
    public String home() {
        return "redirect:http://localhost:3000/";
    }

    @GetMapping("/series")
    public String series() {
        return "redirect:http://localhost:3000/series";
    }

    @GetMapping("/top")
    public String top() {
        return "redirect:http://localhost:3000/top";
    }

    @GetMapping("/statistics")
    public String statistics() {
        return "redirect:http://localhost:3000/statistics";
    }
}

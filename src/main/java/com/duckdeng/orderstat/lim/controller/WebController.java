package com.duckdeng.orderstat.lim.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;

@Controller
public class WebController {
    @GetMapping("/")
    public String redirectToHome(Model model){
        return "duckHomePage";
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndPoint() {
        return ResponseEntity.ok("Test WebController ok");
    }
}

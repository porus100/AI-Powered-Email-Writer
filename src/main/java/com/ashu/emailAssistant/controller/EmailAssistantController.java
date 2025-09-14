package com.ashu.emailAssistant.controller;

import com.ashu.emailAssistant.Dto.EmailRequestDto;
import com.ashu.emailAssistant.service.EmailAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailAssistantController {
    @Autowired
    EmailAssistantService service;
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequestDto request){
        return ResponseEntity.ok(service.generateEmail(request));
    }
}

package com.ashu.emailAssistant.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebConfiguration {
    @Bean
    public WebClient webClient(@Value("${gemini.api.base-url}")String baseUrl){
        return WebClient.builder()
                .baseUrl(baseUrl)
                .build();

    }
}

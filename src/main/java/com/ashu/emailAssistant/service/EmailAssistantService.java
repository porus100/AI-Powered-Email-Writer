package com.ashu.emailAssistant.service;

import com.ashu.emailAssistant.Dto.EmailRequestDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class EmailAssistantService {
    @Autowired
    Gson gson;
    @Autowired
    WebClient client;
    @Value("${gemini.api.key}")
    private String apiKey;


    public String generateEmail(EmailRequestDto request) {
        //steps
        //build prompt
        String prompt=buildPrompt(request);
        //prepare raw JSON Body
        String requestBody=String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }""",prompt);
        //send Request
        //Extract response
        String response=client.post()
                        .uri(uriBuilder -> uriBuilder.path("/v1beta/models/gemini-2.0-flash:generateContent").build())
                        .header("Content-Type", "application/json")
                        .header("X-goog-api-key", apiKey)
                        .body(BodyInserters.fromValue(requestBody))
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();//block to wait for response
        return extractResponse(response);
    }
    public String buildPrompt(EmailRequestDto request){
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a professional email reply");
        if(request.getTone()!=null && !request.getTone().isEmpty()){
            prompt.append("Use a ").append(request.getTone());
        }
        prompt.append("Original Email: \n").append(request.getEmailContent());
        return prompt.toString();
    }
    public String extractResponse(String response){
        try{
            ObjectMapper mapper=new ObjectMapper();


            JsonNode root=mapper.readTree(response);
            String content=root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
            JsonNode totalTokenCountNode = root.path("usageMetadata").path("totalTokenCount");
            if(totalTokenCountNode.isNumber()){
                return content + " (Total tokens: " + totalTokenCountNode.asText() + ")";
            }else{
                return content+" Token's count not available";
            }
        }catch(Exception e)
        {
            throw new RuntimeException(e.toString());
        }


    }

}

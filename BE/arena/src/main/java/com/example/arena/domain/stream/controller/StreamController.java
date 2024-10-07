package com.example.arena.domain.stream.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class StreamController {
    private static final Logger log = LoggerFactory.getLogger(StreamController.class);
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;

    @MessageMapping("arena.share.{groupId}")
    public void share(
            @DestinationVariable("groupId") final Long groupId,
            @Payload final SimpleRequest request
    ) {
        rabbitTemplate.convertAndSend(
            exchangeName, routingKey+"." + groupId, request
        );
    }
}

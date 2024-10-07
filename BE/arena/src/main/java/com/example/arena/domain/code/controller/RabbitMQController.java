package com.example.arena.domain.code.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.arena.domain.code.dto.request.ChatDto;
import com.example.arena.domain.code.dto.request.ExampleTerminalDto;
import com.example.arena.domain.code.dto.request.MessageDto;
import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.dto.request.TerminalDto;
import com.example.arena.domain.code.service.RabbitMQService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/rabbitmq")
@RequiredArgsConstructor
public class RabbitMQController {
	@Autowired
	private RabbitMQService rabbitMQService;

	@Value("${rabbitmq.queue.name}")
	private String queueName;

	private final SimpMessagingTemplate simpMessagingTemplate;

	// 에디터에 코드 작성하는 메서드
	@MessageMapping("/code/edit")
	public void sendCode(MessageDto message) {
		rabbitMQService.sendMessage(message);
		String dest = "/queue/" + queueName + "." + message.getRoomId();
		simpMessagingTemplate.convertAndSend(dest, message);
	}

	@MessageMapping("/problem")
	public void sendProblem(ProblemDto problem) {
		rabbitMQService.sendProblem(problem);
		String dest = "/queue/" + queueName + "." + problem.getRoomId() + ".problem";
		simpMessagingTemplate.convertAndSend(dest, problem);
	}

	@MessageMapping("/terminal")
	public <T> void sendResult(TerminalDto<T> terminal) {
		rabbitMQService.sendResult(terminal);
	}
//	@MessageMapping("/terminal/examples")
//	public void sendExampleResult(ExampleTerminalDto terminal) {
//		rabbitMQService.sendExampleResult(terminal);
//		String dest = "/queue/" + queueName + "." + terminal.getRoomId()  + ".terminal";
//		simpMessagingTemplate.convertAndSend(dest,terminal);
//	}

	@MessageMapping("/chat")
	public void sendChat(ChatDto chat) {
		String dest = "/queue/" + queueName + "." + chat.getRoomId() + ".chat";
		simpMessagingTemplate.convertAndSend(dest, chat);
		simpMessagingTemplate.convertAndSend(dest, chat);
		simpMessagingTemplate.convertAndSend(dest, chat);
	}

	// expire이 지난 queue를 삭제하는 메서드
	// TODO : String to UUID
	@DeleteMapping("/{roomId}")
	public ResponseEntity<Void> deleteQueue(@PathVariable(name = "roomId") String roomId) {
		rabbitMQService.deleteQueue(roomId);
		return ResponseEntity.noContent().build();
	}
}

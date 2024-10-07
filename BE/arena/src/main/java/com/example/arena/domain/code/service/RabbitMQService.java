package com.example.arena.domain.code.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.arena.domain.code.dto.request.ExampleTerminalDto;
import com.example.arena.domain.code.dto.request.MessageDto;
import com.example.arena.domain.code.dto.request.ProblemDto;
import com.example.arena.domain.code.dto.request.TerminalDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RabbitMQService {

	private final RabbitTemplate rabbitTemplate;

	private final RabbitAdmin rabbitAdmin;

	@Value("${rabbitmq.queue.name}")
	private String queueName;

	public MessageDto sendMessage(MessageDto message) {
		// queue가 있는 지 확인
		String destQueue = queueName + "." + message.getRoomId();
		// 비동기적으로 일어나는가..? 아닌데 왜 큐를 생성하기전에 큐가 생성되어 있는지
		if (!isExists(destQueue)) {
			createQueue(destQueue);
		}
		// TODO : 허용 가능한 queue 사이즈를 넘었는 지 확인 -> roomId를 통해 room의 유효 시간을 알아와서 TTL 적용
		rabbitTemplate.convertAndSend(destQueue, message);
		rabbitTemplate.convertAndSend(destQueue, message);
		rabbitTemplate.convertAndSend(destQueue, message);
		return message;
	}

	private void createQueue(String destQueue) {
		Map<String, Object> args = new HashMap<String, Object>();
		args.put("x-expires", 100000);
		Queue queue = new Queue(destQueue, false, false, false, args);
		rabbitAdmin.declareQueue(queue);
	}

	private boolean isExists(String destQueue) {
		return rabbitAdmin.getQueueInfo(destQueue) != null;
	}

	public void deleteQueue(String roomId) {
		String destQueue = queueName + "." + roomId;
		rabbitAdmin.deleteQueue(destQueue);
	}

	// 문제 보내기
	public void sendProblem(ProblemDto problem) {
		String destQueue = queueName + "." + problem.getRoomId() + ".problem";
		if (!isExists(destQueue))
			createQueue(destQueue);
		rabbitTemplate.convertAndSend(destQueue, problem);
		rabbitTemplate.convertAndSend(destQueue, problem);
	}

	// 터미널 최신화
	public <T> void sendResult(TerminalDto<T> terminal) {
		String destQueue = queueName + "." + terminal.getRoomId() + ".terminal";
		if (!isExists(destQueue)) {
			createQueue(destQueue);
		}
		rabbitTemplate.convertAndSend(destQueue, terminal);
		rabbitTemplate.convertAndSend(destQueue, terminal);
		rabbitTemplate.convertAndSend(destQueue, terminal);
	}

	// 터미널 예제 최신화
	public void sendExampleResult(ExampleTerminalDto terminal) {
		String destQueue = queueName + "." + terminal.getRoomId() + ".terminal";
		if (!isExists(destQueue)) {
			createQueue(destQueue);
		}
		rabbitTemplate.convertAndSend(destQueue, terminal);
		rabbitTemplate.convertAndSend(destQueue, terminal);
		rabbitTemplate.convertAndSend(destQueue, terminal);
	}

}

package com.example.arena.domain.code.executor;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

import com.example.arena.domain.code.dto.request.CodeRequest;
import com.example.arena.domain.code.dto.response.CodeResponse;

public class JAVACodeExecutor implements CodeExecutor {

	@Override
	public CodeResponse execute(String input, CodeRequest request) throws Exception {
		// 1. 파일로 Java 코드 저장
		String className = "UserCode";
		Path tempDir = Files.createTempDirectory("code-executor");
		Path javaFilePath = tempDir.resolve(className + ".java");
		Files.write(javaFilePath, request.getCode().getBytes());

		// 2. Java 코드 컴파일
		JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
		if (compiler.run(null, null, null, javaFilePath.toFile().getPath()) != 0) {
			throw new Exception("Compilation failed.");
		}

		// 3. 컴파일된 클래스 실행
		String classPath = tempDir.toFile().getPath();
		ProcessBuilder processBuilder = new ProcessBuilder("java", "-cp", classPath, className);
		processBuilder.redirectErrorStream(true);

		processBuilder.redirectInput(createInputFile(input, tempDir));
		Process process = processBuilder.start();

		// 4. 코드 실행 시간 측정 및 결과 수집
		long startTime = System.currentTimeMillis();
		String output = collectOutput(process.getInputStream()); // 코드 실행 후 생긴 User output
		long executionTime = System.currentTimeMillis() - startTime;

		int exitCode = process.waitFor();
		boolean isDone = (exitCode == 0);

		// 5. 임시 파일 및 디렉토리 삭제
		Files.deleteIfExists(javaFilePath);
		Files.deleteIfExists(tempDir.resolve(className + ".class"));
		deleteDirectory(tempDir);
		return new CodeResponse(isDone, isDone ? executionTime : -1, output);
	}

	private String collectOutput(InputStream inputStream) throws IOException {
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
			StringBuilder output = new StringBuilder();
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line).append(System.lineSeparator());
			}
			// Remove the last unnecessary new line character
			if (output.length() > 0) {
				output.setLength(output.length() - System.lineSeparator().length());
			}
			return output.toString();
		}
	}

	private File createInputFile(String input, Path tempDir) throws IOException {
		Path inputFilePath = tempDir.resolve("input.txt");
		Files.write(inputFilePath, input.getBytes());
		return inputFilePath.toFile();
	}

	private void deleteDirectory(Path directory) throws IOException {
		if (Files.exists(directory)) {
			try (DirectoryStream<Path> stream = Files.newDirectoryStream(directory)) {
				for (Path entry : stream) {
					Files.deleteIfExists(entry);
				}
			}
			Files.deleteIfExists(directory);
		}
	}
}

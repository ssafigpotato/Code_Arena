package com.example.arena.domain.code.executor;

import com.example.arena.domain.code.dto.request.CodeRequest;
import com.example.arena.domain.code.dto.response.CodeResponse;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

public class PYTHONCodeExecutor implements CodeExecutor {

    @Override
    public CodeResponse execute(String input, CodeRequest request) throws Exception {
        String scriptName = "UserCode.py";
        Path tempDir = Files.createTempDirectory("code-executor");
        Path scriptFilePath = tempDir.resolve(scriptName);
        Files.write(scriptFilePath, request.getCode().getBytes());

        ProcessBuilder processBuilder = new ProcessBuilder("python", scriptFilePath.toFile().getPath());
        processBuilder.redirectErrorStream(true);

        processBuilder.redirectInput(createInputFile(input, tempDir));
        Process process = processBuilder.start();

        long startTime = System.currentTimeMillis();
        String output = collectOutput(process.getInputStream());
        long executionTime = System.currentTimeMillis() - startTime;

        boolean isDone = process.waitFor(60, TimeUnit.SECONDS);

        Files.deleteIfExists(scriptFilePath);
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
            if (output.length() > 0) {
                output.setLength(output.length() - System.lineSeparator().length()); // 마지막 개행 삭제
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

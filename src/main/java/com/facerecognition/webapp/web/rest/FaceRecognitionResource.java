package com.facerecognition.webapp.web.rest;
import org.apache.commons.io.FileUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import java.io.IOException;
import java.io.*;
import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.lang.ProcessBuilder;
import java.lang.Process;
import java.lang.InterruptedException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
@RestController
@RequestMapping("/face")
public class FaceRecognitionResource {
    @PostMapping("/upload/file")
    public ResponseEntity<String> faceRecognitionMain(@RequestBody String file) throws IOException, InterruptedException {
        if (file != null) {
            String partSeparator = ",";
            if (file.contains(partSeparator)) {
                String encodedImg = file.split(partSeparator)[1];
                byte[] decodedImg = Base64.getMimeDecoder().decode(encodedImg.getBytes(StandardCharsets.UTF_8));
                FileUtils.writeByteArrayToFile(new File("uploads/user_photo.jpg"), decodedImg);
            }
            ProcessBuilder processBuilder = new ProcessBuilder("face_recognition", "/home/dinara/Documents/face_recognition/known_people/", "/home/dinara/face-recognition-webapp/uploads/user_photo.jpg");
            processBuilder.redirectErrorStream(true);
            File log = new File("output.log");
            processBuilder.redirectOutput(log);
            PrintStream original = System.out;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintStream ps = new PrintStream(baos);
            System.setOut(ps);
            Process process = processBuilder.inheritIO().start();
            process.waitFor();
            String output = new String(baos.toByteArray());
            original.println("output = " + output);
            return new ResponseEntity<>(output, HttpStatus.OK);
        }
        return new ResponseEntity<>("error", HttpStatus.NO_CONTENT);
    }
}

package com.facerecognition.webapp.web.rest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import  org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import java.io.IOException;
import java.io.File;
@RestController
@RequestMapping("/face")
public class FaceRecognitionResource {
    public FaceRecognitionResource () {
    }
    @PostMapping("/upload/file")
    public ResponseEntity<String> faceRecognitionMain(@RequestBody MultipartFile file) throws IOException {
        if (file != null) {
            File uploadDir = new File("/home/assets/upload");
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }
            file.transferTo(new File(file.getOriginalFilename()));
            return new ResponseEntity<>("ok", HttpStatus.OK);
        }
        return new ResponseEntity<>("error", HttpStatus.OK);
    }
}

package com.facerecognition.webapp.web.rest;
import org.apache.commons.io.FileUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import  org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import java.io.IOException;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequestMapping("/face")
public class FaceRecognitionResource {

    @PostMapping("/upload/file")
    public ResponseEntity<String> faceRecognitionMain(@RequestBody String file) throws IOException {
        if (file != null) {
            String partSeparator = ",";
            if (file.contains(partSeparator)) {
                String encodedImg = file.split(partSeparator)[1];
                byte[] decodedImg = Base64.getMimeDecoder().decode(encodedImg.getBytes(StandardCharsets.UTF_8));
                FileUtils.writeByteArrayToFile(new File("uploads/user_photo.png"), decodedImg);
            }
            return new ResponseEntity<>("ok", HttpStatus.OK);
        }
        return new ResponseEntity<>("error", HttpStatus.NO_CONTENT);
    }
}

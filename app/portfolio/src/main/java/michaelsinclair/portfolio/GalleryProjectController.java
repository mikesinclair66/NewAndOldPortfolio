package michaelsinclair.portfolio;

import java.io.IOException;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import michaelsinclair.projectGallery.*;

@RestController
@RequestMapping("/api/project_gallery")
public class GalleryProjectController {
	@GetMapping("/cover/{file_name}")
	public ResponseEntity<byte[]> getImage(@PathVariable("file_name") String fileName) throws IOException {
        // Load the image file
        var imgFile = new ClassPathResource("static/project_gallery/" + fileName);

        // Convert to byte array (blob)
        byte[] imageBytes = StreamUtils.copyToByteArray(imgFile.getInputStream());

        // Set response headers
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg");

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }
	
	@PostMapping("/add/pitch_card")
	public ResponseEntity<Boolean> addPitchCard(@RequestBody PitchCardValidator pitchCard){
		if(true) {
			//request matches security policy
			
			
		}
		
		return ResponseEntity.ok(true);
	}
}

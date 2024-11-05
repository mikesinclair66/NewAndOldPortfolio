package michaelsinclair.portfolio;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import michaelsinclair.services.EmailValidatorMessage;
import michaelsinclair.services.EmailValidatorMessenger;
import michaelsinclair.services.EmailValidatorRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class EmailController {
	@Autowired
    private EmailValidatorMessenger emailMessenger;
	
	private Map<String, String> loadJson(String s1, String s2){
		Map<String, String> map = new HashMap<>();
		map.put(s1,  s2);
		return map;
	}
	
	@PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestBody String[] contactInfo){
		boolean isValid = true;
		String reason = "";
		
		for(int i = 0; i < 2; i++)
			if(contactInfo[i].trim().length() == 0) {
				isValid = false;
				reason = "Please ensure you fill both fields so I can get back to you.";
				break;
			}
		
		int lindex = contactInfo[1].length() - 1;
		if(isValid && (contactInfo[1].lastIndexOf(".") >= lindex
				|| contactInfo[1].lastIndexOf("@") >= lindex)) {
			isValid = false;
			reason = "Email is invalid";
		}
		
		if(isValid)
	        return ResponseEntity.ok(loadJson("id",
	        	emailMessenger.sendValidation(contactInfo[0], contactInfo[1])
	        ));
		else
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(loadJson("reason", reason));		
	}
	
	@PostMapping("/verify")
	public ResponseEntity<?> verify(@RequestBody EmailValidatorRequest evr){
		switch(emailMessenger.requestValidation(evr)) {
			case -1:
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(loadJson("reason",
						"An error occurred trying to locate user's verification code."));
			case 0:
				return ResponseEntity.ok(loadJson("reason", "Your verification code is incorrect."));
			case 1:
				return ResponseEntity.ok(loadJson("reason", "Your verification code has expired."
						+ " Please refresh the page."));
			case 2:
			default:
				return ResponseEntity.ok(loadJson("code", "200"));
		}
	}
	
	@PostMapping("/send_message")
	public ResponseEntity<Boolean> sendMessage(@RequestBody EmailValidatorMessage evm){
		return ResponseEntity.ok(emailMessenger.sendMessage(evm));
	}
}
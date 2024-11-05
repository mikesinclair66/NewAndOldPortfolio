package michaelsinclair.services;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	String name, email, code;
	
	@Autowired
    private JavaMailSender mailSender;
	
	/*
	@Async
	public void sendEmailHome(String textBody, String senderEmail, String name) {
		String _textBody = textBody;
		_textBody += "\n\nYou can reply to this email at " + senderEmail + ".";
		
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("michaelkevin.sinclair@gmail.com");
        message.setSubject("Portfolio email from " + name);
        message.setText(_textBody);
        
        mailSender.send(message);
    }
    */
	
	@Async
	public void sendValidationEmail(String email, String name) {
		this.email = email;
		this.name = name;
		
		String code = "";
		for(int i = 0; i < 4; i++)
			code += Integer.toString(new Random().nextInt(10));
		this.code = code;
		
		SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setFrom("unresponsive@intivatechnologies.ca");
        message.setSubject("Michael Sinclair wants you to validate your email with code " + code);
        message.setText("Hey " + name + " - here is your validation code: " + code +"!"
        		+ "\n\nCheers,\nMichael Sinclair");
        
        mailSender.send(message);
	}
}
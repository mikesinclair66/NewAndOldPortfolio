package michaelsinclair.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class EmailValidatorMessenger {
	@Autowired
    private JavaMailSender mailSender;
	
	@Autowired
    private EmailValidatorRepository emailValidatorRepository;
	
	public EmailValidatorMessenger(EmailValidatorRepository emailValidatorRepository) {
        this.emailValidatorRepository = emailValidatorRepository;
    }
	
	public String sendValidation(String name, String email) {
		String code = "";
		for(int i = 0; i < 4; i++)
			code += Integer.toString(new Random().nextInt(10));
		
        EmailValidator emailValidator = new EmailValidator();
        emailValidator.setEmail(email);
        emailValidator.setName(name);
        emailValidator.setCode(code);
        
        //expires in 15 minutes
        emailValidator.setExpirationDate(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
        emailValidatorRepository.save(emailValidator);
        
        sendValidationEmail(name, email, code);
        return emailValidator.getId();
    }
	
	public int requestValidation(EmailValidatorRequest evr) {
		EmailValidator request = emailValidatorRepository.findById(evr.getId()).get();
		if(request != null) {
			if((new Date()).compareTo(request.getExpirationDate()) > 0) {
				emailValidatorRepository.deleteById(evr.getId());
				return 1;
			} else if(request.getCode().equals(evr.getCode())) {
				request.setHasValidated(true);
				emailValidatorRepository.save(request);
				return 2;
			} else
				return 0;
		} else
			return -1;
	}
	
	public boolean sendMessage(EmailValidatorMessage evm) {
		EmailValidator request = emailValidatorRepository.findById(evm.getId()).get();
		if(request != null) {
			sendEmail(request.getEmail(), "unresponsive@intivatechnologies.ca",
					"You received a message from your portfolio website from " + request.getName(),
					evm.getMessage());
			return true;
		} else
			return false;
	}

	/*
    public boolean validateCode(String userId, String code) {
        ValidationCode validationCode = validationCodeRepository.findByUserIdAndIsUsed(userId, false);
        if (validationCode != null && validationCode.getCode().equals(code)) {
            if (validationCode.getExpirationDate().after(new Date())) {
                validationCode.setUsed(true); // Mark the code as used
                validationCodeRepository.save(validationCode);
                return true; // Code is valid
            }
        }
        return false; // Invalid code or expired
    }
    */
	
	private void sendEmail(String to, String from, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setFrom(from);
		message.setSubject(subject);
		message.setText(text);
		
		mailSender.send(message);
	}
	
	@Async
	private void sendValidationEmail(String name, String email, String code) {
        sendEmail(email, "unresponsive@intivatechnologies.ca",
        		"Michael Sinclair wants you to validate your email with code " + code,
        		"Hey " + name + " - here is your validation code: " + code +"!"
                		+ "\n\nCheers,\nMichael Sinclair");
	}
}

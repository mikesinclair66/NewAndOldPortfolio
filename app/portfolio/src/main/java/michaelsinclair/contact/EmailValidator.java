package michaelsinclair.contact;

import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;
import michaelsinclair.security.Validator;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "email_validators")
public class EmailValidator extends Validator {
    private String name, email, code;
    private boolean hasValidated = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;
    
    public void setName(String name) {
    	this.name = name;
    }
    
    public void setEmail(String email) {
    	this.email = email;
    }
    
    public void setCode(String code) {
    	this.code = code;
    }
    
    public void setHasValidated(boolean hasValidated) {
    	this.hasValidated = hasValidated;
    }
    
    public void setExpirationDate(Date date) {
    	expirationDate = date;
    }
    
    public String getName() {
    	return name;
    }
    
    public String getEmail() {
    	return email;
    }
    
    public String getCode() {
    	return code;
    }
    
    public boolean getHasValidated() {
    	return hasValidated;
    }
    
    public Date getExpirationDate() {
    	return expirationDate;
    }
}

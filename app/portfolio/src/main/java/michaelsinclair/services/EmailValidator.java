package michaelsinclair.services;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;

@Entity
@Document(collection = "email_validators")
public class EmailValidator {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String name, email, code;
    private boolean hasValidated = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;
    
    public void setId(String id) {
    	this.id = id;
    }
    
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
    
    public String getId() {
    	return id;
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

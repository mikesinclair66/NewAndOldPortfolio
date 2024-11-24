package michaelsinclair.security;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Validator {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected String id;
	
	public void setId(String id) {
    	this.id = id;
    }
	
	public String getId() {
    	return id;
    }
}

package michaelsinclair.services;

public class EmailValidatorMessage {
	private String id, message;
	
	public void setId(String id) {
		this.id = id;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	String getId() {
		return id;
	}
	
	String getMessage() {
		return message;
	}
}

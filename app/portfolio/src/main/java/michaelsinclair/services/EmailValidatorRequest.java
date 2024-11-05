package michaelsinclair.services;

public class EmailValidatorRequest {
	private String code, id;
	
	public void setCode(String code) {
		this.code = code;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}
	
	public String getId() {
		return id;
	}
}

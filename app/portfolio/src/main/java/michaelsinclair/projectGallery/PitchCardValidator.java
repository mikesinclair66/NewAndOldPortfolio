package michaelsinclair.projectGallery;

import java.util.HashMap;

import org.springframework.data.mongodb.core.mapping.Document;

import michaelsinclair.security.Validator;

@Document(collection = "pitch_card_validators")
public class PitchCardValidator extends Validator {
	private HashMap<String, String> texts = new HashMap<>();
	private HashMap<String, Integer> values = new HashMap<>();
	private String imgName;
	
	public void setTexts(String imgName, String projectName, String subtext) {
		this.imgName = imgName;
		texts.put("projectName", projectName);
		texts.put("subtext", subtext);
	}
	
	public void setValues(int size, int subject, int platform, int purpose, int date) {
		values.put("size", size);
		values.put("subject", subject);
		values.put("platform", platform);
		values.put("purpose", purpose);
		values.put("date", date);
	}
	
	public String getImageName() { return imgName; }
	
	public HashMap<String, String> getTexts(){ return texts; }
	
	public HashMap<String, Integer> getValues(){ return values; }
}

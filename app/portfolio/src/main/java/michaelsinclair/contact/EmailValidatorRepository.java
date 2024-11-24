package michaelsinclair.contact;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmailValidatorRepository extends MongoRepository<EmailValidator, String> {}

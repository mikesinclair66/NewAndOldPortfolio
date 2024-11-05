package michaelsinclair.services;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface EmailValidatorRepository extends MongoRepository<EmailValidator, String> {

}

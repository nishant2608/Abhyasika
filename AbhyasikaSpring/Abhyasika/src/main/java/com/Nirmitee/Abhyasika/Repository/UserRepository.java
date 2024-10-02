package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<AbhyasikaUser,String> {
    AbhyasikaUser findByUsername(String username);
}

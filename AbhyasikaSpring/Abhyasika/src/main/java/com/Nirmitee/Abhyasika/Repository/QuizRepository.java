package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    Quiz findByQid(String qid);
    List<Quiz> findAllByCid(String cid);
}

package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChapterRepository extends MongoRepository<Chapter, String> {
    Chapter findByCid(String cid);
}

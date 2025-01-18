package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Topic;
import com.Nirmitee.Abhyasika.Model.TopicQuery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TopicRepository extends MongoRepository<Topic, String> {
    Topic findByTid(String tid);

    List<Topic> findAllByCid(String cid);
}

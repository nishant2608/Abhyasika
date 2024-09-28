package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project,String> {

}

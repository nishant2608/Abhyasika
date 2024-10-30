package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project,String> {
    List<Project> findByNameContaining(String name);
}

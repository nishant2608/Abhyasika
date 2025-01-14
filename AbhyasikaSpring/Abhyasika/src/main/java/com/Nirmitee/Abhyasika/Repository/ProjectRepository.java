package com.Nirmitee.Abhyasika.Repository;

import com.Nirmitee.Abhyasika.Model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByIsPublicTrue();

    Project findByPid(String pid);
}
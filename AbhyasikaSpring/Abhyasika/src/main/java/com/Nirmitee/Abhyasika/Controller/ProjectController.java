package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import com.Nirmitee.Abhyasika.Service.ProjectService;
import com.Nirmitee.Abhyasika.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "true")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @GetMapping("/project/public")
    public List<ProjectDTO> getAllPublicProjects(){
        return projectService.getAllPublicProjects();
    }

    @GetMapping("/user/ownedProjects")
    public List<ProjectDTO> getOwnedProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getProjectsByUser(token);
    }

    @PostMapping("/user/project")
    public ResponseEntity<Project> createProject(@RequestBody Project project, HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        Project createdProject = projectService.createProject(project,token);
        AbhyasikaUser createdUser = userService.addProjectToUser(project, token);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

}

package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Model.AbhyasikaUser;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.ProjectDTO;
import com.Nirmitee.Abhyasika.Model.UserDTO;
import com.Nirmitee.Abhyasika.Service.JWTService;
import com.Nirmitee.Abhyasika.Service.ProjectService;
import com.Nirmitee.Abhyasika.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "true")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

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

    @GetMapping("/user/viewProjects")
    public List<ProjectDTO> getViewProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getViewProjectsByUser(token);
    }

    @GetMapping("/user/editProjects")
    public List<ProjectDTO> getEditProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getEditProjectsByUser(token);
    }

    @GetMapping("/user/project/{pid}")
    public ResponseEntity<?> getProjectById(HttpServletRequest request,@PathVariable String pid){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);

        Project project = projectService.findById(pid);
        if (project == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }

        boolean isOwner = false;
        boolean hasViewPermission = false;
        boolean hasEditPermission = false;

        if (user.getOwnedProjects()!=null){
            isOwner = user.getOwnedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
        }

        if(user.getViewedProjects()!=null){
            hasViewPermission = user.getViewedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
        }

        if(user.getEditedProjects()!=null){
            hasEditPermission = user.getEditedProjects().stream().anyMatch(p -> p.getPid().equals(pid));
        }

        if (isOwner || hasViewPermission || hasEditPermission) {
            return ResponseEntity.ok(project);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to view this project");
        }
    }

    @PostMapping("/user/project")
    public ResponseEntity<Project> createProject(@RequestBody Project project, HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        Project createdProject = projectService.createProject(project,token);
        userService.addProjectToUser(project, token);
        if(project.getEditors()!=null){
            for(UserDTO editor: project.getEditors()){
                userService.addEditProjectToUser(project, editor.getUsername());
            }
        }
        if(project.getViewers()!=null){
            for(UserDTO viewer: project.getViewers()){
                userService.addViewProjectToUser(project, viewer.getUsername());
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PutMapping("/user/project/{pid}/addViewers")
    public ResponseEntity<?> addViewers(@RequestBody List<UserDTO> viewers, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project existingProject = projectService.findById(pid);
        if (existingProject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }
        if (!existingProject.getOwner().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to edit this project");
        }
        if (existingProject.getViewers() == null) {
            existingProject.setViewers(new ArrayList<>());
        }
        for (UserDTO viewer : viewers) {
            existingProject.getViewers().add(viewer);
            userService.addViewProjectToUser(existingProject, viewer.getUsername());
        }
        Project updatedProject = projectService.updateProject(existingProject);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping("/user/project/{pid}/addEditors")
    public ResponseEntity<?> addEditors(@RequestBody List<UserDTO> editors, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project existingProject = projectService.findById(pid);
        if (existingProject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }
        if (!existingProject.getOwner().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to edit this project");
        }
        if (existingProject.getEditors() == null) {
            existingProject.setEditors(new ArrayList<>());
        }
        for (UserDTO editor : editors) {
            existingProject.getEditors().add(editor);
            userService.addEditProjectToUser(existingProject, editor.getUsername());
        }
        Project updatedProject = projectService.updateProject(existingProject);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping("/user/project/{pid}/removeViewers")
    public ResponseEntity<?> removeViewers(@RequestBody List<UserDTO> viewers, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project existingProject = projectService.findById(pid);
        if (existingProject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }
        if (!existingProject.getOwner().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to edit this project");
        }
        if (existingProject.getViewers() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No viewers to remove");
        }
        for (UserDTO viewer : viewers) {
            existingProject.getViewers().removeIf(v -> v.getUsername().equals(viewer.getUsername()));
            userService.removeViewProjectFromUser(existingProject, viewer.getUsername());
        }
        Project updatedProject = projectService.updateProject(existingProject);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping("/user/project/{pid}/removeEditors")
    public ResponseEntity<?> removeEditors(@RequestBody List<UserDTO> editors, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        String username = jwtService.extractUsername(token);
        AbhyasikaUser user = userService.findByUsername(username);
        Project existingProject = projectService.findById(pid);
        if (existingProject == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }
        if (!existingProject.getOwner().getUsername().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to edit this project");
        }
        if (existingProject.getEditors() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No editors to remove");
        }
        for (UserDTO editor : editors) {
            existingProject.getEditors().removeIf(e -> e.getUsername().equals(editor.getUsername()));
            userService.removeEditProjectFromUser(existingProject, editor.getUsername());
        }
        Project updatedProject = projectService.updateProject(existingProject);
        return ResponseEntity.ok(updatedProject);
    }


}

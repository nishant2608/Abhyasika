package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Service.JWTService;
import com.Nirmitee.Abhyasika.Service.ProjectService;
import com.Nirmitee.Abhyasika.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://nirmitee.xyz", allowCredentials = "true", allowedHeaders = "true")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private JWTService jwtService;

    @GetMapping("/project/public")
    public List<Project> getAllPublicProjects(){
        return projectService.getAllPublicProjects();
    }

    @GetMapping("/user/ownedProjects")
    public List<Project> getOwnedProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getProjectsByUser(token);
    }

    @GetMapping("/user/viewProjects")
    public List<Project> getViewProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getViewProjectsByUser(token);
    }

    @GetMapping("/user/editProjects")
    public List<Project> getEditProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return userService.getEditProjectsByUser(token);
    }

    @GetMapping("/user/project/{pid}")
    public ResponseEntity<?> getProjectById(HttpServletRequest request,@PathVariable String pid){

        try{
            String authtoken = request.getHeader("Authorization");
            String token = authtoken.substring(7);
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            if(projectResponse==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
            }
            return ResponseEntity.ok(projectResponse);
        }catch(NotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }catch(NoAccessException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
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

    @PutMapping("/user/project/{pid}")
    public ResponseEntity<?> editProject(@RequestBody Project project, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        try{
            Project updatedProject = projectService.editProject(project, token, pid);
            return ResponseEntity.ok(updatedProject);
        }
        catch (NotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (NoAccessException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PutMapping("/user/project/{pid}/updatePublic")
    public ResponseEntity<?> updatePublic(@RequestBody Project project, @PathVariable String pid, HttpServletRequest request) {
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        try{
            Project updatedProject = projectService.updatePublic(project, token, pid);
            return ResponseEntity.ok(updatedProject);
        }
        catch (NotFound e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
        catch (NoAccessException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
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
            boolean viewerExists = existingProject.getViewers().stream()
                    .anyMatch(e -> e.getUsername().equals(viewer.getUsername()));
            if (!viewerExists) {
                existingProject.getViewers().add(viewer);
                if(existingProject.getEditors()!=null){
                    Iterator<UserDTO> iterator = existingProject.getEditors().iterator();
                    while (iterator.hasNext()) {
                        UserDTO editor = iterator.next();
                        if (editor.getUsername().equals(viewer.getUsername())) {
                            iterator.remove();
                            userService.removeEditProjectFromUser(existingProject, editor.getUsername());
                        }
                    }
                }
                userService.addViewProjectToUser(existingProject, viewer.getUsername());
            }
        }
        Project updatedProject = projectService.updateProject(existingProject);
        return ResponseEntity.ok(updatedProject);
    }
// todo: editor viewer both locha
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
            boolean editorExists = existingProject.getEditors().stream()
                    .anyMatch(e -> e.getUsername().equals(editor.getUsername()));
            if (!editorExists) {
                existingProject.getEditors().add(editor);
                if(existingProject.getViewers()!=null){
                    Iterator<UserDTO> iterator = existingProject.getViewers().iterator();
                    while (iterator.hasNext()) {
                        UserDTO viewer = iterator.next();
                        if (viewer.getUsername().equals(editor.getUsername())) {
                            iterator.remove();
                            userService.removeViewProjectFromUser(existingProject, viewer.getUsername());
                        }
                    }
                }
                userService.addEditProjectToUser(existingProject, editor.getUsername());
            }
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

package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Service.ProjectService;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class ProjectController {
    @Autowired
    private ProjectService projectService;

    @GetMapping("/project")
    public List<Project> getAllProjects(){
        return projectService.getAllProjects();
    }

    @GetMapping("/list/project")
    public List<ProjectDTO> getAllProjectList(){
        return projectService.getAllProjectList();
    }

    @GetMapping("/user/project")
    public List<ProjectDTO> getProjectsByUser(HttpServletRequest request){
        String authtoken = request.getHeader("Authorization");
        String token = authtoken.substring(7);
        return projectService.getProjectsByUser(token);
    }

    @GetMapping("/list/project/{pid}/chapters")
    public List<ChapterDTO> getAllChapterList(@PathVariable String pid){
        return projectService.getChapterList(pid);
    }

    @GetMapping("/list/project/{pid}/chapters/{cid}/topics")
    public List<TopicDTO> getAllTopicList(@PathVariable String pid, @PathVariable String cid){
        return projectService.getTopicList(pid,cid);
    }

    @GetMapping("/project/{pid}")
    public Optional<Project> getProjectById(@PathVariable String pid){
        return projectService.getProjectById(pid);
    }

    @GetMapping("/project/{pid}/chapter")
    public List<Chapter> getAllChapters(@PathVariable String pid){
        return projectService.getChaptersByProjectId(pid);
    }

    @GetMapping("/project/{pid}/chapter/{cid}")
    public Chapter getChapterById(@PathVariable String pid, @PathVariable String cid){
        return projectService.getChapterById(pid,cid);
    }

    @GetMapping("/project/{pid}/chapter/{cid}/topic")
    public List<Topic> getAllTopics(@PathVariable String pid, @PathVariable String cid){
        return projectService.getTopicsByChapterId(pid,cid);
    }

    @GetMapping("/project/{pid}/chapter/{cid}/topic/{tid}")
    public Topic getTopicById(@PathVariable String pid, @PathVariable String cid, @PathVariable String tid){
        return projectService.getTopicById(pid,cid,tid);
    }

    @PostMapping("/project")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @PostMapping("/project/{projectId}/chapters")
    public ResponseEntity<Chapter> addChapterToProject(
            @PathVariable String projectId,
            @RequestBody Chapter chapter) {
        Chapter createdChapter = projectService.addChapterToProject(projectId, chapter);
        if (createdChapter != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdChapter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/project/{projectId}/chapters/{chapterId}/topics")
    public ResponseEntity<Topic> addTopicToChapter(
            @PathVariable String projectId,
            @PathVariable String chapterId,
            @RequestBody Topic topic) {
        Topic createdTopic = projectService.addTopicToChapter(projectId, chapterId, topic);
        if (createdTopic != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTopic);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

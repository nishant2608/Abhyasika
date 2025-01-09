//package com.Nirmitee.Abhyasika.ControllerV1;
//
//import com.Nirmitee.Abhyasika.ModelV1.*;
//import com.Nirmitee.Abhyasika.ServiceV1.ProjectService;
//import com.Nirmitee.Abhyasika.ServiceV1.UserService;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/v1")
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "true")
//public class ProjectController {
//    @Autowired
//    private ProjectService projectService;
//
//    @Autowired
//    private UserService userService;
//
//    @GetMapping("/project")
//    public List<Project> getAllProjects(){
//        return projectService.getAllProjects();
//    }
//
//    @GetMapping("/list/project")
//    public List<ProjectDTO> getAllProjectList(@RequestParam(required = false) String name){
//        if (name != null && !name.isEmpty()) {
//            return projectService.searchProjectsByName(name);
//        } else {
//            return projectService.getAllProjectList();
//        }
//    }
//
//    @GetMapping("/user/project")
//    public List<ProjectDTO> getProjectsByUser(HttpServletRequest request){
//        String authtoken = request.getHeader("Authorization");
//        String token = authtoken.substring(7);
//        return projectService.getProjectsByUser(token);
//    }
//
//    @GetMapping("/list/project/{pid}/chapters")
//    public List<ChapterDTO> getAllChapterList(@PathVariable String pid){
//        return projectService.getChapterList(pid);
//    }
//
//    @GetMapping("/list/project/{pid}/chapters/{cid}/topics")
//    public List<TopicDTO> getAllTopicList(@PathVariable String pid, @PathVariable String cid){
//        return projectService.getTopicList(pid,cid);
//    }
//
//    @GetMapping("/project/{pid}")
//    public Optional<Project> getProjectById(@PathVariable String pid){
//        return projectService.getProjectById(pid);
//    }
//
//    @GetMapping("/project/{pid}/chapter")
//    public List<Chapter> getAllChapters(@PathVariable String pid){
//        return projectService.getChaptersByProjectId(pid);
//    }
//
//    @GetMapping("/project/{pid}/chapter/{cid}")
//    public Chapter getChapterById(@PathVariable String pid, @PathVariable String cid){
//        return projectService.getChapterById(pid,cid);
//    }
//
//    @GetMapping("/project/{pid}/chapter/{cid}/topic")
//    public List<Topic> getAllTopics(@PathVariable String pid, @PathVariable String cid){
//        return projectService.getTopicsByChapterId(pid,cid);
//    }
//
//    @GetMapping("/project/{pid}/chapter/{cid}/topic/{tid}")
//    public Topic getTopicById(@PathVariable String pid, @PathVariable String cid, @PathVariable String tid){
//        return projectService.getTopicById(pid,cid,tid);
//    }
//
//    @GetMapping("/project/{pid}/chapter/{cid}/quiz")
//    public List<QuizDTO> getAllQuizzes(@PathVariable String pid, @PathVariable String cid){
//        return projectService.getQuizzesByChapterId(pid,cid);
//    }
//
//    @GetMapping("/project/{pid}/chapter/{cid}/quiz/{qid}")
//    public QuizQ getQuizById(@PathVariable String pid, @PathVariable String cid, @PathVariable String qid){
//        return projectService.getQuizById(pid,cid,qid);
//    }
//
//
//    @PostMapping("/project")
//    public ResponseEntity<Project> createProject(@RequestBody Project project, HttpServletRequest request) {
//        String authtoken = request.getHeader("Authorization");
//        String token = authtoken.substring(7);
//        Project createdProject = projectService.createProject(project);
//        AbhyasikaUser createdUser = userService.addProjectToUser(project, token);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
//    }
//
//    @PostMapping("/project/{projectId}/chapters")
//    public ResponseEntity<Chapter> addChapterToProject(
//            @PathVariable String projectId,
//            @RequestBody Chapter chapter) {
//        Chapter createdChapter = projectService.addChapterToProject(projectId, chapter);
//        if (createdChapter != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdChapter);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping("/project/{projectId}/chapters/{chapterId}/topics")
//    public ResponseEntity<Topic> addTopicToChapter(
//            @PathVariable String projectId,
//            @PathVariable String chapterId,
//            @RequestBody Topic topic) {
//        Topic createdTopic = projectService.addTopicToChapter(projectId, chapterId, topic);
//        if (createdTopic != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdTopic);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PostMapping("/project/{projectId}/chapters/{chapterId}/quiz")
//    public ResponseEntity<Quiz> addQuizToChapter(
//            @PathVariable String projectId,
//            @PathVariable String chapterId,
//            @RequestBody Quiz quiz) {
//        Quiz createdQuiz = projectService.addQuizToChapter(projectId, chapterId, quiz);
//        if (createdQuiz != null) {
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdQuiz);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
//
//    @PutMapping("/project/{projectId}/chapters/{chapterId}/topics/{topicId}")
//    public ResponseEntity<Topic> updateTopicInChapter(
//        @PathVariable String projectId,
//        @PathVariable String chapterId,
//        @PathVariable String topicId,
//        @RequestBody Topic topic) {
//    Topic updatedTopic = projectService.updateTopicInChapter(projectId, chapterId, topicId, topic);
//    if (updatedTopic != null) {
//        return ResponseEntity.ok(updatedTopic);
//    } else {
//        return ResponseEntity.notFound().build();
//    }
//}
//}

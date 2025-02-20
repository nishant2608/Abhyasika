package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.Topic;
import com.Nirmitee.Abhyasika.Service.TopicService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/t")
@CrossOrigin(origins = "http://nirmitee.xyz", allowCredentials = "true", allowedHeaders = "true")
public class TopicController {

    @Autowired
    private TopicService topicService;

    @PostMapping("/project/{pid}/chapter/{cid}/topic")
    public ResponseEntity<?> createTopicForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @RequestBody Topic topic) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Topic newTopic = topicService.createTopicForChapter(token, pid, cid, topic);
            return ResponseEntity.ok(newTopic);
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter/{cid}/topic")
    public ResponseEntity<?> getAllTopicsForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(topicService.getAllTopicsForChapter(token, pid, cid));
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter/{cid}/topic/{tid}")
    public ResponseEntity<?> getTopicForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String tid) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(topicService.getTopicByTid(token, pid, cid, tid));
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/project/{pid}/chapter/{cid}/topic/{tid}")
    public ResponseEntity<?> updateTopicForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String tid, @RequestBody Topic topic) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(topicService.updateTopicForChapter(token, pid, cid, tid, topic));
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}

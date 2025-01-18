package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.Chapter;
import com.Nirmitee.Abhyasika.Model.ChapterDTO;
import com.Nirmitee.Abhyasika.Service.ChapterService;
import com.Nirmitee.Abhyasika.Service.JWTService;
import com.Nirmitee.Abhyasika.Service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/c")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true", allowedHeaders = "true")
public class ChapterController {
    @Autowired
    private ChapterService chapterService;

    @Autowired
    private ProjectService projectService;


    @GetMapping("/project/{pid}/chapter/{cid}")
    public ResponseEntity<?> getChapterForProject(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid){
        try{
            String token = request.getHeader("Authorization").substring(7);
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            return ResponseEntity.ok(chapter);
        }
        catch(NotFound e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        catch(NoAccessException e){
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter")
    public ResponseEntity<?> getAllChaptersForProject(HttpServletRequest request, @PathVariable String pid){
        try{
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(chapterService.getAllChaptersForProject(token, pid));
        }
        catch(NotFound e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        catch(NoAccessException e){
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PostMapping("/project/{pid}/chapter")
    public ResponseEntity<?> createChapterForProject(HttpServletRequest request, @PathVariable String pid, @RequestBody Chapter chapter){
        try{
            String token = request.getHeader("Authorization").substring(7);
            Chapter newChapter = chapterService.createChapterForProject(token, pid, chapter);
            ChapterDTO chapterDTO = new ChapterDTO(newChapter.getCid(), pid);
            projectService.addChapterToProject(pid, chapterDTO);
            return ResponseEntity.ok(newChapter);
        }
        catch(NotFound e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        catch(NoAccessException e){
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/project/{pid}/chapter/{cid}")
    public ResponseEntity<?> updateChapterForProject(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @RequestBody Chapter chapter){
        try{
            String token = request.getHeader("Authorization").substring(7);
            Chapter updatedChapter = chapterService.updateChapterForProject(token, pid, cid, chapter);
            return ResponseEntity.ok(updatedChapter);
        }
        catch(NotFound e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        catch(NoAccessException e){
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }



}

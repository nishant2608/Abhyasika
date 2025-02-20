package com.Nirmitee.Abhyasika.Controller;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.AnsweredQuestion;
import com.Nirmitee.Abhyasika.Model.Quiz;
import com.Nirmitee.Abhyasika.Model.ScoreCard;
import com.Nirmitee.Abhyasika.Service.QuizService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/q")
@CrossOrigin(origins = "http://nirmitee.xyz", allowCredentials = "true", allowedHeaders = "true")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @PostMapping("/project/{pid}/chapter/{cid}/quiz")
    public ResponseEntity<?> createQuizForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @RequestBody Quiz quiz) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Quiz newQuiz = quizService.createQuizForChapter(token, pid, cid, quiz);
            return ResponseEntity.ok(newQuiz);
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter/{cid}/quiz/{qid}")
    public ResponseEntity<?> getQuizForChapter(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String qid) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(quizService.getQuizByQid(token, pid, cid, qid));
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter/{cid}/quiz/{qid}/review")
    public ResponseEntity<?> getQuizForReview(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String qid) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(quizService.getQuizByQidForReview(token, pid, cid, qid));
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/project/{pid}/chapter/{cid}/quiz/{qid}/scorecard")
    public ResponseEntity<?> getScoreCardForQuiz(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String qid) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            ScoreCard scoreCard = quizService.getScoreCardForUser(token, pid, cid, qid);
            if(scoreCard==null){
                return ResponseEntity.status(409).body("Scorecard not found");
            }
            return ResponseEntity.ok(scoreCard);
        } catch (NotFound e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (NoAccessException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PostMapping("/project/{pid}/chapter/{cid}/quiz/{qid}/submit")
    public ResponseEntity<?> submitQuiz(HttpServletRequest request, @PathVariable String pid, @PathVariable String cid, @PathVariable String qid, @RequestBody List<AnsweredQuestion> responses){
        try{
            String token = request.getHeader("Authorization").substring(7);
            return ResponseEntity.ok(quizService.submitQuiz(token, pid, cid, qid, responses));
        }
        catch(NotFound e){
            return ResponseEntity.status(404).body(e.getMessage());
        }
        catch(NoAccessException e){
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}

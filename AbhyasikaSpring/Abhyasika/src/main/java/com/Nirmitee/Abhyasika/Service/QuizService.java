package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuizService {
    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ChapterService chapterService;


    @Autowired
    private JWTService jwtService;

    public Quiz createQuizForChapter(String token, String pid, String cid, Quiz quiz){
        try{
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            if(!projectResponse.isEditAccess()){
                throw new NoAccessException("No Access");
            }
            if(projectResponse.getProject().getChapters().stream().anyMatch(chapterDTO -> chapterDTO.getCid().equals(cid))){
                quiz.setPid(pid);
                quiz.setCid(cid);
                if(quiz.getNegativeMarking()==null){
                    quiz.setNegativeMarking(false);
                }
                Quiz newQuiz = quizRepository.save(quiz);
                QuizDTO quizDTO = new QuizDTO(newQuiz.getQid(),newQuiz.getName(), cid, pid);
                chapterService.addQuizToChapter(cid, quizDTO);
                return newQuiz;

            }
            else{
                throw new NotFound("Chapter not found");
            }
        }
        catch(NotFound e){
            throw new NotFound("Project not found");
        }
        catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }

    }

    public QuizTest getQuizByQid(String token,String pid, String cid, String qid){
        try{
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getQuizzes().stream().anyMatch(quizDTO -> quizDTO.getQid().equals(qid))){
                Quiz quiz = quizRepository.findByQid(qid);
                return turnIntoQuizTest(quiz);
            }
            else{
                throw new NotFound("Quiz not found");
            }
        }catch(NotFound e) {
            throw new NotFound("Chapter not found");
        }catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    public ScoreCard getScoreCardForUser(String token,String pid, String cid, String qid){
        try{
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getQuizzes().stream().anyMatch(quizDTO -> quizDTO.getQid().equals(qid))) {
                Quiz quiz = quizRepository.findByQid(qid);
                String username = jwtService.extractUsername(token);
                if(quiz.getLeaderBoard()==null){
                    return null;
                }
                return quiz.getLeaderBoard().stream().filter(scoreCard1 -> scoreCard1.getUsername().equals(username)).findFirst().orElse(null);
            }
            else{
                throw new NotFound("Quiz not found");
            }
        }
        catch(NotFound e) {
            throw new NotFound("Chapter not found");
        }
        catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    public ScoreCard submitQuiz(String token, String pid, String cid, String qid, List<AnsweredQuestion> responses){
        try{
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getQuizzes().stream().anyMatch(quizDTO -> quizDTO.getQid().equals(qid))) {
                Quiz quiz = quizRepository.findByQid(qid);
                String username = jwtService.extractUsername(token);
                if( quiz.getLeaderBoard()!=null && quiz.getLeaderBoard().stream().anyMatch(scoreCard1 -> scoreCard1.getUsername().equals(username))){
                    throw new NoAccessException("Already attempted");
                }
                if(quiz.getQuestions().size()!=responses.size()){
                    throw new NoAccessException("Invalid responses");
                }
                int score = 0;
                int correctQuestions = 0;
                List<String> chosenAnswers = new ArrayList<>();
                boolean negativeMarking = quiz.getNegativeMarking();
                for(int i=0;i<responses.size();i++){
                    if(responses.get(i).getChosenOption()==null || responses.get(i).getChosenOption().isBlank()){
                        chosenAnswers.add("");
                        continue;
                    }
                    chosenAnswers.add(responses.get(i).getChosenOption());
                    if(responses.get(i).getChosenOption().equals(quiz.getQuestions().get(i).getCorrectOption())){
                        score++;
                        correctQuestions++;
                    }
                    else if(negativeMarking){
                        score--;
                    }
                }
                ScoreCard scoreCard = ScoreCard.builder()
                        .qid(qid)
                        .username(username)
                        .score(score)
                        .correctQuestions(correctQuestions)
                        .chosenOptions(chosenAnswers)
                        .build();
                if(quiz.getLeaderBoard()==null){
                    quiz.setLeaderBoard(new ArrayList<>());
                }
                quiz.getLeaderBoard().add(scoreCard);
                quizRepository.save(quiz);
                return scoreCard;
            }
            else{
                throw new NotFound("Quiz not found");
            }
        }
        catch(NotFound e) {
            throw new NotFound("Chapter not found");
        }
        catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    private QuizTest turnIntoQuizTest(Quiz quiz){
        List<Question> questionList = quiz.getQuestions();
        List<QuestionTest> questionTestList = new ArrayList<>();
        for(Question question : questionList){
            QuestionTest questionTest = QuestionTest.builder()
                    .questionString(question.getQuestionString())
                    .option1(question.getOption1())
                    .option2(question.getOption2())
                    .option3(question.getOption3())
                    .option4(question.getOption4())
                    .build();
            questionTestList.add(questionTest);
        }
        return QuizTest.builder()
                .qid(quiz.getQid())
                .name(quiz.getName())
                .cid(quiz.getCid())
                .pid(quiz.getPid())
                .leaderBoard(quiz.getLeaderBoard())
                .negativeMarking(quiz.getNegativeMarking())
                .totalMinutes(quiz.getTotalMinutes())
                .questions(questionTestList)
                .build();
    }

    public Quiz getQuizByQidForReview(String token, String pid, String cid, String qid) {
        try{
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getQuizzes().stream().anyMatch(quizDTO -> quizDTO.getQid().equals(qid))){
                return quizRepository.findByQid(qid);
            }
            else{
                throw new NotFound("Quiz not found");
            }
        }catch(NotFound e) {
            throw new NotFound("Chapter not found");
        }catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }
}

package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChapterService {
    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;


    public Chapter getChapterForProject(String token, String pid, String cid){
        try {
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            Project project = projectResponse.getProject();
            if (project.getChapters().stream().anyMatch(chapter -> chapter.getCid().equals(cid))) {
                return chapterRepository.findByCid(cid);
            } else {
                throw new NotFound("Chapter not found");
            }
        }
        catch (NotFound e){
            throw new NotFound("Project not found");
        }
        catch (NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    public List<Chapter> getAllChaptersForProject(String token, String pid) {
        try {
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            Project project = projectResponse.getProject();
            List<ChapterDTO> dtoList = project.getChapters();
            List<Chapter> chapterList = new ArrayList<>();
            for (ChapterDTO chapterDTO : dtoList) {
                Chapter chapter = chapterRepository.findByCid(chapterDTO.getCid());
                chapterList.add(chapter);
            }
            return chapterList;
        }
        catch (NotFound e){
            throw new NotFound("Project not found");
        }
        catch (NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    public Chapter createChapterForProject(String token, String pid, Chapter chapter) {
        try {
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            Project project = projectResponse.getProject();
            if (projectResponse.isEditAccess()) {
                chapter.setPid(pid);
                return chapterRepository.save(chapter);
            } else {
                throw new NoAccessException("No Edit Access");
            }
        } catch (NotFound e) {
            throw new NotFound("Project not found");
        } catch (NoAccessException e) {
            throw new NoAccessException("No Access for the project");
        }
    }

    public Chapter updateChapterForProject(String token, String pid, String cid, Chapter chapter) {
        try {
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            Project project = projectResponse.getProject();
            if (projectResponse.isEditAccess()) {
                Chapter existingChapter = chapterRepository.findByCid(cid);
                existingChapter.setName(chapter.getName());
                existingChapter.setDescription(chapter.getDescription());
                return chapterRepository.save(existingChapter);
            } else {
                throw new NoAccessException("No Edit Access");
            }
        } catch (NotFound e) {
            throw new NotFound("Project not found");
        } catch (NoAccessException e) {
            throw new NoAccessException("No Access for the project");
        }
    }


    public void addTopicToChapter(String cid, TopicDTO topicDTO) {
        Chapter chapter = chapterRepository.findByCid(cid);
        List<TopicDTO> topicDTOList = chapter.getTopics();
        if(topicDTOList == null){
            topicDTOList = new ArrayList<>();
        }
        topicDTOList.add(topicDTO);
        chapter.setTopics(topicDTOList);
        chapterRepository.save(chapter);
    }

    public void addQuizToChapter(String cid, QuizDTO quizDTO) {
        Chapter chapter = chapterRepository.findByCid(cid);
        List<QuizDTO> quizDTOList = chapter.getQuizzes();
        if(quizDTOList == null){
            quizDTOList = new ArrayList<>();
        }
        quizDTOList.add(quizDTO);
        chapter.setQuizzes(quizDTOList);
        chapterRepository.save(chapter);
    }



}

package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Repository.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    public Chapter createChapterForProject(String token, String pid, Chapter chapter) {
        try {
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            Project project = projectResponse.getProject();
            if (projectResponse.isEditAccess()) {
                chapter.setPid(pid);
                ChapterDTO chapterDTO = new ChapterDTO(chapter.getCid(), chapter.getName(), pid);
                projectService.addChapterToProject(pid, chapterDTO);
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

}

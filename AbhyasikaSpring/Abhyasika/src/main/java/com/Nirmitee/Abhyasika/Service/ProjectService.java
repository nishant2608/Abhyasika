package com.Nirmitee.Abhyasika.Service;

import com.Nirmitee.Abhyasika.Model.Chapter;
import com.Nirmitee.Abhyasika.Model.Project;
import com.Nirmitee.Abhyasika.Model.Topic;
import com.Nirmitee.Abhyasika.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects(){
       return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(String Id){
        return projectRepository.findById(Id);
    }

    public List<Chapter> getChaptersByProjectId(String projectId) {
        Optional<Project> project = projectRepository.findById(projectId);
        return project.map(Project::getChapters).orElse(null);
    }

    public Chapter getChapterById(String projectId, String chapterId){
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            List<Chapter> chapters = project.get().getChapters();
            for (Chapter chapter : chapters) {
                if (chapter.getCid().equals(chapterId)) {
                    return chapter;
                }
            }
        }
        return null;
    }


    public List<Topic> getTopicsByChapterId(String projectId, String chapterId) {
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            List<Chapter> chapters = project.get().getChapters();
            for (Chapter chapter : chapters) {
                if (chapter.getCid().equals(chapterId)) {
                    return chapter.getTopics();
                }
            }
        }
        return null; // or throw an exception, or return an empty list
    }

    public Topic getTopicById(String projectId, String chapterId,String topicId){
        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isPresent()) {
            List<Chapter> chapters = project.get().getChapters();
            for (Chapter chapter : chapters) {
                if (chapter.getCid().equals(chapterId)) {
                    List<Topic> topics = chapter.getTopics();
                    for(Topic topic : topics){
                        if(topic.getTid().equals(topicId)){
                            return topic;
                        }
                    }
                }
            }
        }
        return null;
    }

    public Project createProject(Project project) {
        if(project.getChapters()!=null){
            for (Chapter chapter : project.getChapters()) {
                chapter.setCid(String.valueOf(UUID.randomUUID()));
                if(chapter.getTopics()!=null){
                    for (Topic topic : chapter.getTopics()) {
                        topic.setTid(String.valueOf(UUID.randomUUID()));
                    }
                }
            }
        }
        return projectRepository.save(project);
    }

    public Chapter addChapterToProject(String projectId, Chapter chapter) {
        Optional<Project> project = projectRepository.findById(projectId);
        chapter.setCid(String.valueOf(UUID.randomUUID()));
        if(chapter.getTopics()!=null){
            for (Topic topic : chapter.getTopics()) {
                topic.setTid(String.valueOf(UUID.randomUUID()));
            }
        }
        if (project.isPresent()) {
            if (project.get().getChapters() == null) {
                project.get().setChapters(new ArrayList<>());
            }
            project.get().getChapters().add(chapter);
            projectRepository.save(project.get());
            return chapter;
        }
        return null; // or throw an exception
    }

    public Topic addTopicToChapter(String projectId, String chapterId, Topic topic) {
        Optional<Project> project = projectRepository.findById(projectId);
        topic.setTid(String.valueOf(UUID.randomUUID()));
        if (project.isPresent()) {
            List<Chapter> chapters = project.get().getChapters();
            if(chapters!=null){
                for (Chapter chapter : chapters) {
                    if (chapter.getCid().equals(chapterId)) {
                        if (chapter.getTopics() == null) {
                            chapter.setTopics(new ArrayList<>());
                        }
                        chapter.getTopics().add(topic);
                        projectRepository.save(project.get());
                        return topic;
                    }
                }
            }

        }
        return null; // or throw an exception
    }
}

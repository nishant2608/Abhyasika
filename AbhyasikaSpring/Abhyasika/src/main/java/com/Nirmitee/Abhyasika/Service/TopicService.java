package com.Nirmitee.Abhyasika.Service;


import com.Nirmitee.Abhyasika.Exception.NoAccessException;
import com.Nirmitee.Abhyasika.Exception.NotFound;
import com.Nirmitee.Abhyasika.Model.*;
import com.Nirmitee.Abhyasika.Repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ChapterService chapterService;


    public Topic createTopicForChapter(String token, String pid, String cid, Topic topic){
        try{
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            if(!projectResponse.isEditAccess()){
                throw new NoAccessException("No Access");
            }
            if(projectResponse.getProject().getChapters().stream().anyMatch(chapterDTO -> chapterDTO.getCid().equals(cid))){
                topic.setPid(pid);
                topic.setCid(cid);
                Topic newTopic = topicRepository.save(topic);
                TopicDTO topicDTO = new TopicDTO(newTopic.getTid(), cid, pid);
                chapterService.addTopicToChapter(cid, topicDTO);
                return newTopic;

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

    public List<TopicQuery> getAllTopicsForChapter(String token, String pid, String cid){
        try{
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            if(projectResponse.getProject().getChapters().stream().anyMatch(chapterDTO -> chapterDTO.getCid().equals(cid))){
                List<Topic> topicList = topicRepository.findAllByCid(cid);
                List<TopicQuery> topicQueryList = new ArrayList<>();
                for(Topic topic : topicList) {
                    TopicQuery topicQuery = new TopicQuery();
                    topicQuery.setTid(topic.getTid());
                    topicQuery.setCid(topic.getCid());
                    topicQuery.setPid(topic.getPid());
                    topicQuery.setName(topic.getName());
                    topicQueryList.add(topicQuery);
                }
                return topicQueryList;
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

    public Topic getTopicByTid(String token, String pid, String cid, String tid){
        try{
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getTopics().stream().anyMatch(topicDTO -> topicDTO.getTid().equals(tid))){
                return topicRepository.findByTid(tid);
            }
            else{
                throw new NotFound("Topic not found");
            }
        } catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }

    public Topic updateTopicForChapter(String token, String pid, String cid, String tid, Topic topic){
        try{
            ProjectResponse projectResponse = projectService.getProjectById(token, pid);
            if(!projectResponse.isEditAccess()){
                throw new NoAccessException("No Access");
            }
            Chapter chapter = chapterService.getChapterForProject(token, pid, cid);
            if(chapter.getTopics().stream().anyMatch(topicDTO -> topicDTO.getTid().equals(tid))){
                Topic existingTopic = topicRepository.findByTid(tid);
                existingTopic.setName(topic.getName());
                existingTopic.setContent(topic.getContent());
                return topicRepository.save(existingTopic);
            }
            else{
                throw new NotFound("Topic not found");
            }
        } catch(NoAccessException e){
            throw new NoAccessException("No Access");
        }
    }
}

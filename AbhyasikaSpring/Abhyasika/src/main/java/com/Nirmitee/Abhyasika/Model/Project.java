package com.Nirmitee.Abhyasika.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "Projects")
public class Project {
    @Id
    private String pid;
    private String name;
    private String description;
    private boolean isPublic;
    private UserDTO owner;
    private List<UserDTO> editors;
    private List<UserDTO> viewers;
    private List<ChapterDTO> chapters;

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public List<UserDTO> getEditors() {
        return editors;
    }

    public void setEditors(List<UserDTO> editors) {
        this.editors = editors;
    }

    public List<UserDTO> getViewers() {
        return viewers;
    }

    public void setViewers(List<UserDTO> viewers) {
        this.viewers = viewers;
    }

    public List<ChapterDTO> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterDTO> chapters) {
        this.chapters = chapters;
    }
}

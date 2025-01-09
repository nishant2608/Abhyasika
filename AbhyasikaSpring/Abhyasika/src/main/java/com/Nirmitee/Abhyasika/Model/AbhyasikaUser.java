package com.Nirmitee.Abhyasika.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "AbhyasikaUser")
public class AbhyasikaUser {
    @Id
    private String uid;
    private String name;
    private String email;
    private String password;
    private String username;
    private List<ProjectDTO> ownedProjects;
    private List<ProjectDTO> editedProjects;
    private List<ProjectDTO> viewedProjects;

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<ProjectDTO> getOwnedProjects() {
        return ownedProjects;
    }

    public void setOwnedProjects(List<ProjectDTO> ownedProjects) {
        this.ownedProjects = ownedProjects;
    }

    public List<ProjectDTO> getEditedProjects() {
        return editedProjects;
    }

    public void setEditedProjects(List<ProjectDTO> editedProjects) {
        this.editedProjects = editedProjects;
    }

    public List<ProjectDTO> getViewedProjects() {
        return viewedProjects;
    }

    public void setViewedProjects(List<ProjectDTO> viewedProjects) {
        this.viewedProjects = viewedProjects;
    }
}

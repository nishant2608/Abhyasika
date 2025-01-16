package com.Nirmitee.Abhyasika.Model;

public class ProjectResponse {
    private Project project;
    private boolean editAccess;

    public ProjectResponse(Project project, boolean editAccess) {
        this.project = project;
        this.editAccess = editAccess;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public boolean isEditAccess() {
        return editAccess;
    }

    public void setEditAccess(boolean editAccess) {
        this.editAccess = editAccess;
    }
}

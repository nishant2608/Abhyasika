package com.Nirmitee.Abhyasika.Model;

public class ProjectDTO {
    private String pid;
    private String name;

    public ProjectDTO(String pid, String name) {
        this.pid = pid;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }
}

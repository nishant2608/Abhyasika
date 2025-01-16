package com.Nirmitee.Abhyasika.Model;

public class ChapterDTO {
    private String cid;
    private String name;
    private String pid;

    public ChapterDTO(String cid, String name, String pid) {
        this.cid = cid;
        this.name = name;
        this.pid = pid;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
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

package com.Nirmitee.Abhyasika.Model;

public class ChapterDTO {
    private String cid;
    private String pid;

    public ChapterDTO(String cid, String pid) {
        this.cid = cid;
        this.pid = pid;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }


    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }
}

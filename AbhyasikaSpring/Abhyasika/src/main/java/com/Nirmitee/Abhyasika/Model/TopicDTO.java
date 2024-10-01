package com.Nirmitee.Abhyasika.Model;

public class TopicDTO {
    private String tid;
    private String name;

    public TopicDTO(String tid, String name) {
        this.tid = tid;
        this.name = name;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

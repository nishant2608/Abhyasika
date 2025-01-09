package com.Nirmitee.Abhyasika.ModelV1;

import org.springframework.data.annotation.Id;

public class Topic {
    @Id
    private String tid;
    private String name;
    private String content;

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

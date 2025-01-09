package com.Nirmitee.Abhyasika.ModelV1;

public class QuizDTO {
    private String qid;
    private String name;

    public QuizDTO(String qid, String name) {
        this.qid = qid;
        this.name = name;
    }

    public String getQid() {
        return qid;
    }

    public void setQid(String qid) {
        this.qid = qid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

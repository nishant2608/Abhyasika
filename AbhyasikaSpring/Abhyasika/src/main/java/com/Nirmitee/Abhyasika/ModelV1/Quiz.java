package com.Nirmitee.Abhyasika.ModelV1;

import org.springframework.data.annotation.Id;

import java.util.List;

public class Quiz {
    @Id
    private String qid;
    private String name;
    private List<Question> questions;

    public String getQid() {
        return qid;
    }

    public void setQid(String qid) {
        this.qid = qid;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

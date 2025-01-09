package com.Nirmitee.Abhyasika.ModelV1;

import java.util.List;

public class QuizQ {
    private String qid;
    private String name;
    private List<QuestionDTO> questions;

    public QuizQ(String qid, String name, List<QuestionDTO> questions) {
        this.qid = qid;
        this.name = name;
        this.questions = questions;
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

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
}

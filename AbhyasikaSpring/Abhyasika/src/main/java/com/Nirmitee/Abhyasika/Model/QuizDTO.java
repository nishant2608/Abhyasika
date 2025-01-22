package com.Nirmitee.Abhyasika.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
@AllArgsConstructor
public class QuizDTO {
    private String qid;
    private String name;
    private String cid;
    private String pid;
}

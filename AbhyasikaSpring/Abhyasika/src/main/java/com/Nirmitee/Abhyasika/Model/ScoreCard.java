package com.Nirmitee.Abhyasika.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class ScoreCard {
    private String qid;
    private String username;
    private Integer score;
    private List<String> chosenOptions;
    private Integer correctQuestions;
}

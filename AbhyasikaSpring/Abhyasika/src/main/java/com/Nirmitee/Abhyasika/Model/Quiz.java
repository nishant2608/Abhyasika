package com.Nirmitee.Abhyasika.Model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "Quiz")
@Builder
@Getter
@Setter
public class Quiz {
    @Id
    private String qid;
    private String name;
    private String cid;
    private String pid;
    private List<Question> questions;
    private List<ScoreCard> leaderBoard;
    private Integer totalMinutes;
    private Boolean negativeMarking;

}

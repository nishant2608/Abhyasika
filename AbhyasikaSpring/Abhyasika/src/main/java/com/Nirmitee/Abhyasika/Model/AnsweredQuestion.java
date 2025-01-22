package com.Nirmitee.Abhyasika.Model;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AnsweredQuestion {
    private String questionString;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String chosenOption;
}

package com.Nirmitee.Abhyasika.Model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class Question {
    private String questionString;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String correctOption;
}

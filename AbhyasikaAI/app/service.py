# app/service.py
import os
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

class QuestionFormat(BaseModel):
    questionString: str
    option1: str
    option2: str
    option3: str
    option4: str
    correctOption: str

class QuizFormat(BaseModel):
    questions: list[QuestionFormat]

def process_content(data):
    # Implement your business logic here
    if data.get("messages"):
        message = data.get("messages")
        chat_completion = client.chat.completions.create(
            messages=message,
            model="gpt-4o-mini",
            temperature=0.7,
        )
        return {"response":chat_completion.choices[0].message.content}
    else:
        return {"response":"No messages found"}
    
def process_quiz(data):
    # Implement your business logic here
    if data.get("messages"):
        quiz = data.get("messages")
        quiz_completion = client.beta.chat.completions.parse(
            messages=quiz,
            model="gpt-4o",
            temperature=0.7,
            response_format=QuizFormat,
        )
        return quiz_completion.choices[0].message.content
    else:
        return {"response":"No quiz found"}
    
# app/service.py
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

def process_data(data):
    # Implement your business logic here
    if data.get("messages"):
        message = data.get("messages")[0].get("content")
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": message,
                }
            ],
            model="gpt-4o-mini",
        )
        print(chat_completion)
        return {"response":chat_completion.choices[0].message.content}
    else:
        return {"response":"No messages found"}
    
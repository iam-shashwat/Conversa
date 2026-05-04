
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.db.database import SessionLocal, engine, Base

from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    content: str
    conversation_id: str

@app.get("/")
def root():
    return {"message": "Conversa backend running"}

conversations = {}

@app.post("/chat")
def chat(msg: Message):
    if msg.conversation_id not in conversations:
        conversations[msg.conversation_id] = []

    conversations[msg.conversation_id].append({
        "role": "user",
        "content": msg.content
    })

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a helpful assistant"},
            *conversations[msg.conversation_id]
        ]
    )

    reply = response.choices[0].message.content

    conversations[msg.conversation_id].append({
        "role": "assistant",
        "content": reply
    })

    return {"reply": reply}
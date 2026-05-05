import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


@lru_cache(maxsize=1)
def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing. Add it to backend/.env.")

    return Groq(api_key=api_key)


def generate_response(messages):
    response = get_client().chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
        messages=messages,
    )
    content = response.choices[0].message.content

    if not content:
        raise RuntimeError("The AI provider returned an empty response.")

    return content

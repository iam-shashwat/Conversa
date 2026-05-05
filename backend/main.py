from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

try:
    from .app.db.database import Base, SessionLocal, engine
    from .app.models.message import MessageDB
    from .app.schemas.message import Message
    from .app.services.ai import generate_response
except ImportError:
    from app.db.database import Base, SessionLocal, engine
    from app.models.message import MessageDB
    from app.schemas.message import Message
    from app.services.ai import generate_response

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(msg: Message):
    db = SessionLocal()

    try:
        db.add(MessageDB(
            conversation_id=msg.conversation_id,
            role="user",
            content=msg.content
        ))
        db.commit()

        history = db.query(MessageDB)\
            .filter(MessageDB.conversation_id == msg.conversation_id)\
            .order_by(MessageDB.id.asc())\
            .all()

        messages = [
            {"role": "system", "content": "You are a helpful assistant"}
        ] + [
            {"role": m.role, "content": m.content} for m in history
        ]

        reply = generate_response(messages)

        db.add(MessageDB(
            conversation_id=msg.conversation_id,
            role="assistant",
            content=reply
        ))
        db.commit()

        return {"reply": reply}
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Database error while processing the chat request.",
        ) from exc
    except RuntimeError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=f"AI request failed: {exc}") from exc
    finally:
        db.close()


@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str):
    db = SessionLocal()

    try:
        messages = db.query(MessageDB)\
            .filter(MessageDB.conversation_id == conversation_id)\
            .order_by(MessageDB.id.asc())\
            .all()

        return [
            {"role": m.role, "content": m.content}
            for m in messages
        ]
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Database error while loading the conversation.",
        ) from exc
    finally:
        db.close()

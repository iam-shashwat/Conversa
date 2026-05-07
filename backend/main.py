from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

from app.db.database import Base, SessionLocal, engine
from app.models.message import MessageDB
from app.models.user import UserDB

from app.schemas.message import Message
from app.schemas.user import UserSignup, UserLogin

from app.services.ai import generate_response
from app.services.auth import hash_password, verify_password


# =========================
# LOAD ENV
# =========================

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


# =========================
# FASTAPI APP
# =========================

app = FastAPI()


# =========================
# CREATE DATABASE TABLES
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# CHAT ENDPOINT
# =========================

@app.post("/chat")
def chat(msg: Message):
    db = SessionLocal()

    try:
        # Save user message
        db.add(MessageDB(
            conversation_id=msg.conversation_id,
            role="user",
            content=msg.content
        ))
        db.commit()

        # Fetch conversation history
        history = db.query(MessageDB)\
            .filter(MessageDB.conversation_id == msg.conversation_id)\
            .order_by(MessageDB.id.asc())\
            .all()

        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant"
            }
        ] + [
            {
                "role": m.role,
                "content": m.content
            }
            for m in history
        ]

        # Generate AI response
        reply = generate_response(messages)

        # Save AI response
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
            detail="Database error while processing the chat request."
        ) from exc

    except RuntimeError as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(exc)
        ) from exc

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=502,
            detail=f"AI request failed: {exc}"
        ) from exc

    finally:
        db.close()


# =========================
# GET CONVERSATION
# =========================

@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: str):
    db = SessionLocal()

    try:
        messages = db.query(MessageDB)\
            .filter(MessageDB.conversation_id == conversation_id)\
            .order_by(MessageDB.id.asc())\
            .all()

        return [
            {
                "role": m.role,
                "content": m.content
            }
            for m in messages
        ]

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Database error while loading the conversation."
        ) from exc

    finally:
        db.close()


# =========================
# SIGNUP
# =========================

@app.post("/signup")
def signup(user: UserSignup):
    db = SessionLocal()

    try:
        normalized_email = user.email.strip().lower()
        username = user.username.strip()

        existing_user = db.query(UserDB)\
            .filter(UserDB.email == normalized_email)\
            .first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists."
            )

        new_user = UserDB(
            username=username,
            email=normalized_email,
            password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created",
            "user": {
                "id": new_user.id,
                "name": new_user.username,
                "email": new_user.email
            }
        }

    except SQLAlchemyError as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Database error during signup."
        ) from exc

    finally:
        db.close()


# =========================
# LOGIN
# =========================

@app.post("/login")
def login(user: UserLogin):
    db = SessionLocal()

    try:
        normalized_email = user.email.strip().lower()

        existing_user = db.query(UserDB)\
            .filter(UserDB.email == normalized_email)\
            .first()

        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        if not verify_password(
            user.password,
            existing_user.password
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password."
            )

        return {
            "message": "Login successful",
            "user": {
                "id": existing_user.id,
                "name": existing_user.username,
                "email": existing_user.email
            }
        }

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Database error during login."
        ) from exc

    finally:
        db.close()


# =========================
# GET ALL USERS (DEBUG)
# =========================

@app.get("/users")
def get_all_users():
    db = SessionLocal()

    try:
        users = db.query(UserDB).all()
        return {
            "users": [
                {
                    "id": user.id,
                    "name": user.username,
                    "email": user.email
                }
                for user in users
            ]
        }
    
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Database error while fetching users."
        ) from exc

    finally:
        db.close()

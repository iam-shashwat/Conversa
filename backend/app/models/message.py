from sqlalchemy import Column, Integer, String, Text

try:
    from ..db.database import Base
except ImportError:
    from app.db.database import Base

class MessageDB(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(String)
    role = Column(String)
    content = Column(Text)

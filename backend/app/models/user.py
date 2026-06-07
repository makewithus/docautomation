from sqlalchemy import Column, String,DateTime,Boolean
from sqlalchemy.sql import func
from app.config.database import Base

import uuid

class User(Base):
    __tablename__="users"

    id = Column(String, primary_key=True,default=lambda: str(uuid.uuid4()))
    name= Column(String,nullable=False)
    email=Column(String,unique=True,nullable=False)
    role=Column(String,default='member')
    is_active = Column(Boolean,default=True)
    created_at= Column(DateTime(timezone=True),server_default=func.now())

    def __repr__(self):
        return f"<User {self.name} ({self.role})>"
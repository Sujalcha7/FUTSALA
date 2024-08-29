from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique= True, index= True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    reserves = relationship("Reservation", back_populates = "reservor")
    
class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key= True)
    date_time = Column(String, index= True)
    duration = Column(Integer, index= True)
    reservor_id = Column(Integer, ForeignKey("users.id"))
    
    reservor = relationship("User", back_populates = "reserves")
    
    
    
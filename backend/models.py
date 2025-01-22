from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum, Numeric, Date, Time, UniqueConstraint, JSON
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime


class RoleEnum(enum.Enum):
    MANAGER = "manager"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"

class ReservationType(enum.Enum):
    NORMAL_BOOKING = "normal_booking"
    PERIODIC_BOOKING = "periodic_booking"
    EVENT_BOOKING = "event_booking"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phonenumber = Column(String, nullable=False)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.CUSTOMER)
    
    tasks = relationship("Task", back_populates="user")
    reserves = relationship("Reservation", back_populates="reservor")
    
    

class Court(Base):
    __tablename__ = "courts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    court_name = Column(String, nullable=False)
    court_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    capacity = Column(Integer)
    hourly_rate = Column(Numeric(10, 2), nullable=False)
    is_available = Column(Boolean, default=True)
    images = Column(JSON, nullable=True)
    
    reservations = relationship("Reservation", back_populates="court")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True)
    start_date_time = Column(DateTime, index=True)
    end_date_time = Column(DateTime, index=True)
    rate = Column(Integer, default=1000)
    reservor_id = Column(Integer, ForeignKey("users.id"))
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=True)
    status = Column(String, default="Pending")
    
    reservor = relationship("User", back_populates="reserves")
    court = relationship("Court", back_populates="reservations")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    due_date = Column(DateTime)
    status = Column(String, default="pending")
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="tasks")
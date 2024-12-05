from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Enum, Numeric, Date, Time, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base
import enum


class RoleEnum(enum.Enum):
    OWNER = "owner"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"

class EventTypeEnum(enum.Enum):
    TOURNAMENT = "tournament"
    FRIENDLY_MATCH = "friendly_match"
    TRAINING = "training"
    LEAGUE = "league"

class EventStatusEnum(enum.Enum):
    UPCOMING = "upcoming"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(RoleEnum), nullable=True)
    full_name = Column(String, nullable=True)
    
    reserves = relationship("Reservation", back_populates="reservor")
    events_organized = relationship("FutsalEvent", back_populates="organizer")
    event_participations = relationship("EventParticipant", back_populates="user")

class Court(Base):
    __tablename__ = "courts"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    court_name = Column(String, nullable=False)
    court_type = Column(String, nullable=False)
    capacity = Column(Integer)
    hourly_rate = Column(Numeric(10, 2), nullable=False)
    is_available = Column(Boolean, default=True)
    
    reservations = relationship("Reservation", back_populates="court")
    events = relationship("FutsalEvent", back_populates="court")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True)
    start_date_time = Column(String, index=True)
    end_date_time = Column(String, index=True)
    rate = Column(Integer, default=1000)
    reservor_id = Column(Integer, ForeignKey("users.id"))
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=True)
    status = Column(String, default="Pending")
    
    reservor = relationship("User", back_populates="reserves")
    court = relationship("Court", back_populates="reservations")

class FutsalEvent(Base):
    __tablename__ = "futsal_events"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_name = Column(String, nullable=False)
    description = Column(String)
    event_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    court_id = Column(Integer, ForeignKey("courts.id"), nullable=False)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    max_participants = Column(Integer)
    current_participants = Column(Integer, default=0)
    registration_fee = Column(Numeric(10, 2), nullable=True)
    event_type = Column(Enum(EventTypeEnum), nullable=False)
    status = Column(Enum(EventStatusEnum), default=EventStatusEnum.UPCOMING)
    
    organizer = relationship("User", back_populates="events_organized")
    court = relationship("Court", back_populates="events")
    participants = relationship("EventParticipant", back_populates="event")

class EventParticipant(Base):
    __tablename__ = "event_participants"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("futsal_events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    payment_status = Column(String, default="Pending")
    
    event = relationship("FutsalEvent", back_populates="participants")
    user = relationship("User", back_populates="event_participations")

    __table_args__ = (
        UniqueConstraint('event_id', 'user_id', name='_event_user_uc'),
    )

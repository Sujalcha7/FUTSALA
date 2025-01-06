from pydantic import BaseModel
from datetime import datetime, date, time
from typing import List, Optional
from enum import Enum

class RoleEnum(str, Enum):
    OWNER = "owner"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"

class EventTypeEnum(str, Enum):
    TOURNAMENT = "tournament"
    FRIENDLY_MATCH = "friendly_match"
    TRAINING = "training"
    LEAGUE = "league"

class EventStatusEnum(str, Enum):
    UPCOMING = "upcoming"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    is_superuser: bool = False

    class Config:
        orm_mode = True

class CourtBase(BaseModel):
    court_name: str
    court_type: str
    capacity: Optional[int] = None
    hourly_rate: float

class Court(CourtBase):
    id: int
    is_available: bool = True

    class Config:
        orm_mode = True

class ReservationBase(BaseModel):
    start_date_time: str
    end_date_time: str
    rate: int = 1000

class ReservationCreate(ReservationBase):
    court_id: Optional[int] = None

class Reservation(ReservationBase):
    id: int
    reservor_id: int
    court_id: Optional[int] = None
    status: str = "Pending"

    class Config:
        orm_mode = True

class FutsalEventBase(BaseModel):
    event_name: str
    description: Optional[str] = None
    event_date: date
    start_time: time
    end_time: time
    max_participants: Optional[int] = None
    registration_fee: Optional[float] = None
    event_type: EventTypeEnum
    status: EventStatusEnum = EventStatusEnum.UPCOMING

class FutsalEventCreate(FutsalEventBase):
    court_id: int
    organizer_id: int

class FutsalEvent(FutsalEventBase):
    id: int
    court_id: int
    organizer_id: int
    current_participants: int = 0

    class Config:
        orm_mode = True

class EventParticipantBase(BaseModel):
    event_id: int
    user_id: int
    payment_status: str = "Pending"

class EventParticipant(EventParticipantBase):
    id: int

    class Config:
        orm_mode = True

from pydantic import BaseModel
from datetime import datetime, date, time
from typing import List, Optional
from enum import Enum
from .models import ReservationType  # Add this import


class RoleEnum(str, Enum):
    OWNER = "owner"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"

    # role: Optional[RoleEnum] = None
    
class UserLogin(BaseModel):
    email: str
    password: str
    # username: Optional[str] = None
    # phonenumber: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    phonenumber: str
    avatar_url: str
    password: str
    
class EmployeeCreate(BaseModel):
    username: str
    email: str
    phonenumber: str
    avatar_url: str
    password: str

class ManagerCreate(BaseModel):
    username: str
    email: str
    phonenumber: str
    avatar_url: str
    password: str

class User(BaseModel):
    id: int
    email: str
    username: str
    phonenumber: str
    avatar_url: str
    is_active: bool = True

    class Config:
        orm_mode = True

class CourtCreate(BaseModel):
    court_name: str
    court_type: str
    capacity: int
    description: str
    hourly_rate: float
    is_available: bool = True
    images: Optional[List[str]] = None

class Court(BaseModel):
    id: int
    court_name: str
    court_type: str
    description: str
    capacity: int
    hourly_rate: float
    is_available: bool
    images: Optional[List[str]] = None

    class Config:
        orm_mode = True

class ReservationBase(BaseModel):
    start_date_time: datetime
    end_date_time: datetime
    rate: int = 1000

class ReservationCreate(BaseModel):
    start_date_time: datetime
    end_date_time: datetime
    court_id: int
    # type: ReservationType = ReservationType.NORMAL_BOOKING

class Reservation(ReservationBase):
    id: int
    reservor_id: int
    court_id: Optional[int] = None
    status: str = "Pending"

    class Config:
        orm_mode = True
        
class TaskBase(BaseModel):
    title: str
    description: str
    due_date: datetime
    status: str = "pending"
    

class TaskCreate(TaskBase):
    # assigned
    title: str
    description: str
    due_date: datetime
    status: str = "pending"
    

class Task(TaskBase):
    id: int
    assigned_to: int
    created_at: datetime

    class Config:
        from_attributes = True


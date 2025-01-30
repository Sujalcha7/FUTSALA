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

class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    phonenumber: str | None = None
    is_active: bool | None = None
    
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

class EmployeeResponse(BaseModel):
    id: int
    username: str
    email: str
    phonenumber: str
    is_active: bool
    role: str

    class Config:
        from_attributes = True

class UserTask(BaseModel):
    username: str | None = None
    email: str



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

class ReservationWithCourt(BaseModel):
    id: int
    start_date_time: datetime
    end_date_time: datetime
    rate: int
    status: str
    court: Court

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
    
class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: datetime | None = None
    status: str | None = None

class Task(TaskBase):
    id: int
    assigned_to: int
    created_at: datetime

    class Config:
        from_attributes = True



class TaskWithEmployee(BaseModel):
    id: int
    title: str
    description: str | None = None
    due_date: datetime | None = None
    status: str = "pending"
    assigned_to: int | None = None
    created_at: datetime
    user: UserTask | None = None

    class Config:
        from_attributes = True

class PermissionResponse(BaseModel):
    permissions: List[str]

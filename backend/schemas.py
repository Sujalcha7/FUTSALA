from pydantic import BaseModel
from datetime import datetime, date, time
from typing import List, Optional
from enum import Enum

class RoleEnum(str, Enum):
    OWNER = "owner"
    EMPLOYEE = "employee"
    CUSTOMER = "customer"

class UserBase(BaseModel):
    email: str
    # role: Optional[RoleEnum] = None
    
class UserLogin(UserBase):
    email: str
    password: str
    # username: Optional[str] = None
    # phonenumber: Optional[str] = None

class UserCreate(UserBase):
    username: str
    email: str
    phonenumber: str
    password: str
    
class EmployeeCreate(UserBase):
    username: str
    email: str
    phonenumber: str
    password: str

class ManagerCreate(UserBase):
    username: str
    email: str
    phonenumber: str
    password: str

class User(UserBase):
    id: int
    is_active: bool = True

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
    start_date_time: datetime
    end_date_time: datetime
    rate: int = 1000

class ReservationCreate(ReservationBase):
    court_id: Optional[int] = None
    status: str = "Pending"

class Reservation(ReservationBase):
    id: int
    reservor_id: int
    court_id: Optional[int] = None
    status: str = "Pending"

    class Config:
        orm_mode = True


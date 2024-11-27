#this is for data validation and serialization

from pydantic import BaseModel
from datetime import datetime
class ReservationBase(BaseModel):
    # month : datetime.month
    pass

class ReservationCreate(ReservationBase):
    date_time: datetime
    duration: int #| None = None

class Reservation(ReservationBase):
    id: int
    date_time: datetime  
    duration: int 
    reservor_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    pass

class UserCreate(UserBase):
    email: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    reservor: list[Reservation] = []

    class Config:
        orm_mode = True
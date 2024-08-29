#this is for data validation and serialization

from pydantic import BaseModel
# from datetime import datetime
class ReservationBase(BaseModel):
    date_time: str
    duration: int #| None = None

class ReservationCreate(ReservationBase):
    pass

class Reservation(ReservationBase):
    id: int
    reservor_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    reservor: list[Reservation] = []

    class Config:
        orm_mode = True
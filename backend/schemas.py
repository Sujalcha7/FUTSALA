#this is for data validation and serialization

from pydantic import BaseModel
from datetime import datetime
class ReservationBase(BaseModel):
    # month : datetime.month
    pass

class ReservationCreate(ReservationBase):
    start_date_time: datetime
    end_date_time: datetime
    rate: int
    
class Reservation(ReservationBase):
    id: int
    start_date_time: datetime  
    end_date_time: datetime  
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
    is_superuser: bool
    reservor: list[Reservation] = []

    class Config:
        orm_mode = True
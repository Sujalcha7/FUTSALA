import hashlib
import os
from base64 import b64encode, b64decode
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import datetime

from . import models, schemas

def hash_password(password: str) -> str:
    salt = os.urandom(16)  # Generate a 16-byte salt
    password_bytes = password.encode('utf-8')  # Encode password to bytes
    hashed_password = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, 100000)
    return b64encode(salt + hashed_password).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    decoded = b64decode(hashed_password.encode('utf-8'))
    salt = decoded[:16]  # Extract the first 16 bytes as the salt
    stored_hash = decoded[16:]  # The rest is the actual hash
    password_bytes = plain_password.encode('utf-8')
    new_hash = hashlib.pbkdf2_hmac('sha256', password_bytes, salt, 100000)
    return new_hash == stored_hash

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_reserves(db: Session, skip: int = 1, limit: int = 100):
    return db.query(models.Reservation).offset(skip - 1).limit(limit).all()

def get_reserves_by_id(db: Session, user_id: int):
    return db.query(models.Reservation).filter(models.Reservation.reservor_id == user_id).all()

def get_check_reserves(db: Session, date_time: datetime):
    # Parse the input date_time
    input_date = date_time.replace(tzinfo=None)
    
    # Query the database for matching reservations
    matching_reservations = db.query(models.Reservation).filter(
        extract('year', models.Reservation.date_time) == input_date.year,
        extract('month', models.Reservation.date_time) == input_date.month,
        extract('day', models.Reservation.date_time) == input_date.day,
        extract('hour', models.Reservation.date_time) == input_date.hour,
        # extract('minute', models.Reservation.date_time) == input_date.minute
    ).all()
    
    return matching_reservations

def create_user_Reservation(db: Session, Reservation: schemas.ReservationCreate, user_id: int):
    db_Reservation = models.Reservation(**Reservation.dict(), reservor_id=user_id)
    db.add(db_Reservation)
    db.commit()
    db.refresh(db_Reservation)
    return db_Reservation

def get_total_users_count(db: Session):
    return db.query(models.User).count()

def get_active_users_count(db: Session):
    return db.query(models.User).filter(models.User.is_active == True).count()

def get_total_reservations_count(db: Session):
    return db.query(models.Reservation).count()

def get_month_reservations_count(db: Session):
    current_month = datetime.now().month
    current_year = datetime.now().year
    return db.query(models.Reservation).filter(
        extract('month', models.Reservation.date_time) == current_month,
        extract('year', models.Reservation.date_time) == current_year
    ).count()

def calculate_total_revenue(db: Session):
    # Assuming you have a price field in Reservation model
    total = db.query(func.sum(models.Reservation.price)).scalar() or 0
    return total

def calculate_month_revenue(db: Session):
    current_month = datetime.now().month
    current_year = datetime.now().year
    month_revenue = db.query(func.sum(models.Reservation.price)).filter(
        extract('month', models.Reservation.date_time) == current_month,
        extract('year', models.Reservation.date_time) == current_year
    ).scalar() or 0
    return month_revenue

def get_reservation_trends(db: Session):
    # Get reservations count by month for the last 6 months
    trends = db.query(
        func.extract('month', models.Reservation.date_time).label('month'),
        func.count(models.Reservation.id).label('reservations')
    ).group_by('month').order_by('month').all()
    
    return [
        {"month": trend.month, "reservations": trend.reservations}
        for trend in trends
    ]
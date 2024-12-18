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
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_reserves(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation).offset(skip).limit(limit).all()

def get_reserves_by_id(db: Session, user_id: int):
    return db.query(models.Reservation).filter(models.Reservation.reservor_id == user_id).all()

def get_reserves_by_day(db: Session, start_date_time: datetime):
    input_date = start_date_time.replace(tzinfo=None)
    matching_reservations = db.query(models.Reservation).filter(
        extract('year', models.Reservation.start_date_time) == input_date.year,
        extract('month', models.Reservation.start_date_time) == input_date.month,
        extract('day', models.Reservation.start_date_time) == input_date.day,
    ).all()
    return matching_reservations

def get_check_reserves(db: Session, start_date_time: datetime):
    input_date = start_date_time.replace(tzinfo=None)
    matching_reservations = db.query(models.Reservation).filter(
        extract('year', models.Reservation.start_date_time) == input_date.year,
        extract('month', models.Reservation.start_date_time) == input_date.month,
        extract('day', models.Reservation.start_date_time) == input_date.day,
        extract('hour', models.Reservation.start_date_time) == input_date.hour,
    ).all()
    
    return matching_reservations

def create_user_reservation(db: Session, reservation: schemas.ReservationCreate, user_id: int):
    db_reservation = models.Reservation(
        **reservation.dict(), 
        reservor_id=user_id, 
        court_id=reservation.court_id,
        status=reservation.status if reservation.status else "Pending"
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

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
        extract('month', models.Reservation.start_date_time) == current_month,
        extract('year', models.Reservation.start_date_time) == current_year
    ).count()

def calculate_total_revenue(db: Session):
    total = db.query(func.sum(models.Reservation.rate)).scalar() or 0
    return total

def calculate_month_revenue(db: Session):
    current_month = datetime.now().month
    current_year = datetime.now().year
    month_revenue = db.query(func.sum(models.Reservation.rate)).filter(
        extract('month', models.Reservation.start_date_time) == current_month,
        extract('year', models.Reservation.start_date_time) == current_year
    ).scalar() or 0
    return month_revenue

def get_reservation_trends(db: Session):
    trends = db.query(
        func.extract('month', models.Reservation.start_date_time).label('month'),
        func.count(models.Reservation.id).label('reservations')
    ).group_by('month').order_by('month').all()
    
    return [
        {"month": trend.month, "reservations": trend.reservations}
        for trend in trends
    ]

def create_futsal_event(db: Session, event: schemas.FutsalEventCreate):
    db_event = models.FutsalEvent(
        **event.dict(),
        current_participants=0,
        status=event.status if event.status else models.EventStatusEnum.UPCOMING
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def add_event_participant(db: Session, participant: schemas.EventParticipantBase):
    db_participant = models.EventParticipant(
        **participant.dict(),
        payment_status=participant.payment_status if participant.payment_status else "Pending"
    )
    db.add(db_participant)
    db.commit()
    db.refresh(db_participant)

    # Update current participants count in the event
    event = db.query(models.FutsalEvent).filter(models.FutsalEvent.id == participant.event_id).first()
    if event:
        event.current_participants += 1
        db.commit()

    return db_participant

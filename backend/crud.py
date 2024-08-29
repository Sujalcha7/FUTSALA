from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_reserves(db: Session, skip: int = 1, limit: int = 100):
    return db.query(models.Reservation).offset(skip - 1).limit(limit).all()


def create_user_Reservation(db: Session, Reservation: schemas.ReservationBase, user_id: int):
    db_Reservation = models.Reservation(**Reservation.dict(), reservor_id=user_id)
    db.add(db_Reservation)
    db.commit()
    db.refresh(db_Reservation)
    return db_Reservation
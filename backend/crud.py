import hashlib
import os
from base64 import b64encode, b64decode
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import extract, func
from datetime import datetime
from . import models, schemas
from typing import List, Optional

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

def get_all_employees(db: Session):
    return db.query(models.User).filter(models.User.role == models.RoleEnum.EMPLOYEE).all()

# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email, 
        phonenumber=user.phonenumber, 
        avatar_url=user.avatar_url,
        hashed_password=hashed_password,
        # role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_employee(db: Session, user: schemas.EmployeeCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email, 
        phonenumber=user.phonenumber, 
        avatar_url=user.avatar_url,
        hashed_password=hashed_password,
        role=models.RoleEnum.EMPLOYEE
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_manager(db: Session, user: schemas.ManagerCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email, 
        phonenumber=user.phonenumber, 
        avatar_url=user.avatar_url, 
        hashed_password=hashed_password,
        role=models.RoleEnum.MANAGER
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_court(db: Session, court: schemas.CourtCreate):
    db_court = models.Court(
        court_name=court.court_name,
        court_type=court.court_type,
        capacity=court.capacity,
        hourly_rate=court.hourly_rate,
        is_available=court.is_available,
        images=court.images,
        description=court.description
    )
    db.add(db_court)
    db.commit()
    db.refresh(db_court)
    return db_court

def get_users(db: Session):
    return db.query(models.User).filter(models.User.role == models.RoleEnum.CUSTOMER).all()

def get_court_by_id(db: Session, court_id: int):
    return db.query(models.Court).filter(models.Court.id == court_id).first()

def get_reserves(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Reservation).offset(skip).limit(limit).all()

def get_all_reserves(db: Session):
    return db.query(models.Reservation).all()

def get_reserves_by_id(db: Session, user_id: int):
    return db.query(models.Reservation).filter(models.Reservation.reservor_id == user_id).all()


def get_current_reserves_by_id(db: Session, user_id: int):
    current_time = datetime.now()
    return db.query(models.Reservation).filter(
        models.Reservation.reservor_id == user_id,
        models.Reservation.start_date_time >= current_time
    ).all()

def get_past_reserves_by_id(db: Session, user_id: int):
    current_time = datetime.now()
    return db.query(models.Reservation).filter(
        models.Reservation.reservor_id == user_id,
        models.Reservation.start_date_time < current_time
    ).all()

def get_reserves_by_day(db: Session, court_id: int, start_date_time: datetime):
    input_date = start_date_time.replace(tzinfo=None)
    matching_reservations = db.query(models.Reservation).filter(
        models.Reservation.court_id == court_id,
        extract('year', models.Reservation.start_date_time) == input_date.year,
        extract('month', models.Reservation.start_date_time) == input_date.month,
        extract('day', models.Reservation.start_date_time) == input_date.day,
    ).all()
    return matching_reservations

def get_check_reserves(db: Session, court_id: int, start_date_time: datetime):
    if isinstance(start_date_time, str):
        start_date_time = datetime.fromisoformat(start_date_time)
    input_date = start_date_time.replace(tzinfo=None)
    matching_reservations = db.query(models.Reservation).filter(
        models.Reservation.court_id == court_id,
        extract('year', models.Reservation.start_date_time) == input_date.year,
        extract('month', models.Reservation.start_date_time) == input_date.month,
        extract('day', models.Reservation.start_date_time) == input_date.day,
        extract('hour', models.Reservation.start_date_time) == input_date.hour,
    ).all()
    
    return matching_reservations

def create_user_reservation(db: Session, reservation: schemas.ReservationCreate, user_id: int):
    db_reservation = models.Reservation(
        **reservation.dict(), 
        reservor_id=user_id
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

def update_user(db: Session, user_id: int, user_data: schemas.UserUpdate):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        update_data = user_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        db.commit()
        db.refresh(user)
        return user
    return None

def get_all_tasks(db: Session):
    try:
        tasks = (
            db.query(models.Task)
            .options(joinedload(models.Task.user))
            .all()
        )
        print(f"Tasks found: {len(tasks)}") # Debug log
        for task in tasks:
            print(f"Task {task.id}: assigned_to={task.assigned_to}, user={task.user}") # Debug log
        return tasks
    except Exception as e:
        print(f"Error getting tasks: {e}")
        return []

def get_employee_tasks_by_id(db: Session, employee_id: int):
    return db.query(models.Task).filter(
        models.Task.assigned_to == employee_id
    ).all()

def assign_task(db: Session, task: schemas.TaskCreate, employee_id: int):
    db_task = models.Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        status=task.status,
        assigned_to=employee_id
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_data: schemas.TaskUpdate):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task:
        for key, value in task_data.items():
            setattr(task, key, value)
        db.commit()
        db.refresh(task)
        return task
    return None

def get_total_users_count(db: Session):
    return db.query(models.User).count()

def get_active_users_count(db: Session):
    """
    Returns the count of active users in the database.

    Args:
        db (Session): The database session used to query the user records.

    Returns:
        int: The number of active users.
    """

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

def get_permissions_by_role(db: Session, role: models.RoleEnum) -> List[str]:
    return db.query(models.Permission).filter(models.Permission.role == role).all()
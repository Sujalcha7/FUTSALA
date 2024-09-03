from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime
from . import crud, models, schemas
from .database import SessionLocal, engine


models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependenc
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/reserves/", response_model=schemas.Reservation)
def create_Reservation_for_user(
    user_id: int, Reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
):
    same_reserves = crud.get_check_reserves(db = db, date_time= Reservation.date_time)
    if not same_reserves:
        return crud.create_user_Reservation(db=db, Reservation=Reservation, user_id=user_id)
    else:
        raise HTTPException(status_code=400, detail="Reservation already exists")


@app.get("/reserves/", response_model=list[schemas.Reservation])
def read_reserves(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reserves = crud.get_reserves(db, skip=skip, limit=limit)
    return reserves


@app.get("/check_reserves/", response_model=list[schemas.Reservation])
def check_reserves(date_time: str = Query(...), db: Session = Depends(get_db)):
    try:
        parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    
    
    reserves = crud.get_check_reserves(db, date_time=parsed_date)
    
    if not reserves:
        raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
    return reserves
# from fastapi import Depends, FastAPI, HTTPException, Query
# from sqlalchemy.orm import Session
# from datetime import datetime
# from . import crud, models, schemas
# from .database import SessionLocal, engine


# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()


# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# @app.post("/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return crud.create_user(db=db, user=user)


# @app.get("/users/", response_model=list[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users


# @app.get("/users/{user_id}", response_model=schemas.User)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# @app.post("/users/{user_id}/reserves/", response_model=schemas.Reservation)
# def create_Reservation_for_user(
#     user_id: int, Reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
# ):
#     same_reserves = crud.get_check_reserves(db = db, date_time= Reservation.date_time)
#     if not same_reserves:
#         return crud.create_user_Reservation(db=db, Reservation=Reservation, user_id=user_id)
#     else:
#         raise HTTPException(status_code=400, detail="Reservation already exists")


# @app.get("/reserves/", response_model=list[schemas.Reservation])
# def read_reserves(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     reserves = crud.get_reserves(db, skip=skip, limit=limit)
#     return reserves


# @app.get("/check_reserves/", response_model=list[schemas.Reservation])
# def check_reserves(date_time: str = Query(...), db: Session = Depends(get_db)):
#     try:
#         parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid date format")
    
    
    
#     reserves = crud.get_check_reserves(db, date_time=parsed_date)
    
#     if not reserves:
#         raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
#     return reserves

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
from . import crud, models, schemas
from .database import SessionLocal, engine
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Serve React App
app.mount("/public", StaticFiles(directory="frontend/public"), name="public")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API routes
@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/api/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/api/users/{user_id}/reserves/", response_model=schemas.Reservation)
def create_Reservation_for_user(
    user_id: int, Reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
):
    same_reserves = crud.get_check_reserves(db=db, date_time=Reservation.date_time)
    if not same_reserves:
        return crud.create_user_reservation(db=db, reservation=reservation, user_id=user_id)
    else:
        raise HTTPException(status_code=400, detail="Reservation already exists")

@app.get("/api/reserves/", response_model=list[schemas.Reservation])
def read_reserves(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reserves = crud.get_reserves(db, skip=skip, limit=limit)
    return reserves

@app.get("/api/check_reserves/", response_model=list[schemas.Reservation])
def check_reserves(date_time: str = Query(...), db: Session = Depends(get_db)):
    try:
        parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    reserves = crud.get_check_reserves(db, date_time=parsed_date)
    if not reserves:
        raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
    return reserves

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

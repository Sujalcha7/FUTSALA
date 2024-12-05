from fastapi import Depends, FastAPI, HTTPException, Query, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine, Base
from dotenv import load_dotenv  # Import load_dotenv
import os

Base.metadata.create_all(bind=engine) # This line ensures that tables are created if they don’t exist
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week token expiration


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: Optional[str] = Cookie(None),
    db: Session = Depends(get_db)
):
    if not token:
        # raise HTTPException(
        #     status_code=401,
        #     detail="Not authenticated"
        # )
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            # raise HTTPException(
            #     status_code=401,
            #     detail="Invalid authentication token"
            # )
            return None
        
        user = crud.get_user(db, user_id=int(user_id))
        # if user is None:
        #     # raise HTTPException(
        #     #     status_code=401,
        #     #     detail="User not found"
        #     # )
        #     return None
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )

@app.post("/api/login/")
async def login(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create access token with longer expiration
    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )
    
    # Set more robust cookie
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=60*60*24*7,  # 1 week
        path="/"
    )
    
    return {
        "message": "Successfully logged in",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "is_active": db_user.is_active,
            "is_superuser": db_user.is_superuser
        }
    }

@app.post("/api/logout/")
async def logout(response: Response):
    response.delete_cookie(key="token", path="/")
    return {"message": "Successfully logged out"}

@app.get("/api/current_user/")
async def get_user_info(
    current_user: models.User = Depends(get_current_user)
):
    if (current_user):
        return {
            "id": current_user.id,
            "email": current_user.email,
            "is_superuser": current_user.is_superuser,
            "is_active": current_user.is_active
        }
    else:
        return {}

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is configured correctly"}


@app.get("/api/test-jwt/")
async def test_jwt():
    # Test data to encode in the JWT
    test_data = {"sub": "test-user"}
    
    # Create a JWT token
    token = create_access_token(test_data)
    
    # Attempt to decode the JWT to verify
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "message": "JWT is working!",
            "generated_token": token,
            "decoded_data": decoded_data
        }
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=500, detail="Failed to decode JWT - check your secret key")

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # First check if user with given email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return crud.create_user(db=db, user=user)

@app.get("/api/reserves_by_day/", response_model=list[schemas.Reservation])
def read_reserves_by_day(date_time: str = Query(...), db: Session = Depends(get_db)):
    
    """
    Get all reservations for the day that is passed
    """
    try:
        parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    reservations = crud.get_reserves_by_day(db, start_date_time=parsed_date)
    return reservations

@app.get("/api/reserves_current_user/", response_model=list[schemas.Reservation])
def read_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    
    """
    Get all reservations for the currently logged in user
    """
    reservations = crud.get_reserves_by_id(db, user_id=current_user.id)
    return reservations

@app.get("/api/check_reserves/", response_model=list[schemas.Reservation])
def check_reserves(date_time: str = Query(...), db: Session = Depends(get_db)):
    try:
        parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    reserves = crud.get_check_reserves(db, start_date_time=parsed_date)
    if not reserves:
        raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
    return reserves

@app.post("/api/create_reservation/", response_model=schemas.Reservation)
async def create_reservation_for_user(
    reservation: schemas.ReservationCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure the user does not already have a reservation at the specified date and time
    same_reserves = crud.get_check_reserves(db=db, start_date_time=reservation.start_date_time)
    if same_reserves:
        raise HTTPException(status_code=400, detail="Reservation already exists for this time slot")
    
    return crud.create_user_Reservation(db=db, Reservation=reservation, user_id=current_user.id)
# ... [Previous get_db and create_access_token functions remain the same]

@app.get("/api/courts/", response_model=list[schemas.Court])
async def get_courts(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db),
    available: Optional[bool] = None
):
    """
    Get list of courts with optional filtering
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    query = db.query(models.Court)
    
    # Optional availability filter
    if available is not None:
        query = query.filter(models.Court.is_available == available)
    
    return query.all()

@app.get("/api/courts/{court_id}", response_model=schemas.Court)
async def get_court_details(
    court_id: int,
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Get specific court details
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    court = db.query(models.Court).filter(models.Court.id == court_id).first()
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    
    return court

@app.post("/api/create_court/", response_model=schemas.Court)
async def create_court(
    court: schemas.CourtBase,
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Create a new court (Owner/Employee only)
    """
    if not current_user or current_user.role not in [models.RoleEnum.OWNER, models.RoleEnum.EMPLOYEE]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db_court = models.Court(
        court_name=court.court_name,
        court_type=court.court_type,
        capacity=court.capacity,
        hourly_rate=court.hourly_rate
    )
    
    db.add(db_court)
    db.commit()
    db.refresh(db_court)
    return db_court

@app.get("/api/events/upcoming")
async def get_upcoming_events(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db),
    limit: int = 10
):
    """
    Get upcoming futsal events
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    # Get upcoming events sorted by date
    upcoming_events = db.query(models.FutsalEvent)\
        .filter(models.FutsalEvent.status == models.EventStatusEnum.UPCOMING)\
        .order_by(models.FutsalEvent.event_date)\
        .limit(limit)\
        .all()
    
    return [
        {
            "id": event.id,
            "event_name": event.event_name,
            "event_date": event.event_date,
            "start_time": event.start_time,
            "event_type": event.event_type.value,
            "current_participants": event.current_participants,
            "max_participants": event.max_participants
        } for event in upcoming_events
    ]

@app.post("/api/events/register")
async def register_for_event(
    event_registration: schemas.EventParticipantBase,
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """
    Register current user for an event
    """
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    # Check if event exists
    event = db.query(models.FutsalEvent).filter(
        models.FutsalEvent.id == event_registration.event_id
    ).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if event is full
    if event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is already full")
    
    # Check if user is already registered
    existing_registration = db.query(models.EventParticipant).filter(
        models.EventParticipant.event_id == event_registration.event_id,
        models.EventParticipant.user_id == current_user.id
    ).first()
    
    if existing_registration:
        raise HTTPException(status_code=400, detail="Already registered for this event")
    
    # Create participant record
    participant_data = schemas.EventParticipantBase(
        event_id=event_registration.event_id,
        user_id=current_user.id
    )
    
    # Use CRUD function to add participant and update event
    crud.add_event_participant(db, participant_data)
    
    return {"message": "Successfully registered for the event"}

@app.get("/api/dashboard")
async def get_dashboard(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")

    # Role-based dashboard responses
    if current_user.role == models.RoleEnum.OWNER:
        # Owner gets full dashboard with all statistics
        return {
            "totalUsers": crud.get_total_users_count(db),
            "activeUsers": crud.get_active_users_count(db),
            "totalReservations": crud.get_total_reservations_count(db),
            "monthReservations": crud.get_month_reservations_count(db),
            "totalRevenue": crud.calculate_total_revenue(db),
            "monthRevenue": crud.calculate_month_revenue(db),
            "reservationTrends": crud.get_reservation_trends(db)
        }
    
    elif current_user.role == models.RoleEnum.EMPLOYEE:
        # Employee gets limited dashboard
        return {
            "monthReservations": crud.get_month_reservations_count(db),
            "monthRevenue": crud.calculate_month_revenue(db),
            "reservationTrends": crud.get_reservation_trends(db)
        }
    
    elif current_user.role == models.RoleEnum.CUSTOMER:
        # Customer gets personal dashboard
        return {
            "userReservations": crud.get_reserves_by_id(db, user_id=current_user.id),
            "totalReservations": len(crud.get_reserves_by_id(db, user_id=current_user.id))
        }
    
    raise HTTPException(status_code=403, detail="Access denied")

@app.get("/api/events")
async def get_events(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")

    # If owner or employee, get all events
    if current_user.role in [models.RoleEnum.OWNER, models.RoleEnum.EMPLOYEE]:
        # Fetch all futsal events with details
        events = db.query(models.FutsalEvent).all()
        return [
            {
                "id": event.id,
                "event_name": event.event_name,
                "event_date": event.event_date,
                "start_time": event.start_time,
                "end_time": event.end_time,
                "current_participants": event.current_participants,
                "max_participants": event.max_participants,
                "event_type": event.event_type.value,
                "status": event.status.value
            } for event in events
        ]
    
    # If customer, get events they are participating in
    elif current_user.role == models.RoleEnum.CUSTOMER:
        # Fetch events the user is participating in
        participant_events = db.query(models.FutsalEvent)\
            .join(models.EventParticipant)\
            .filter(models.EventParticipant.user_id == current_user.id)\
            .all()
        
        return [
            {
                "id": event.id,
                "event_name": event.event_name,
                "event_date": event.event_date,
                "start_time": event.start_time,
                "end_time": event.end_time,
                "current_participants": event.current_participants,
                "max_participants": event.max_participants,
                "event_type": event.event_type.value,
                "status": event.status.value
            } for event in participant_events
        ]
    
    raise HTTPException(status_code=403, detail="Access denied")


@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



# @app.post("/api/login/")
# @app.post("/api/logout/")
# @app.get("/api/current_user/")
# @app.get("/test-cors")
# @app.get("/api/test-jwt/")
# @app.post("/api/users/", response_model=schemas.User)
# @app.get("/api/reserves_by_day/", response_model=list[schemas.Reservation])
# @app.get("/api/reserves_current_user/", response_model=list[schemas.Reservation])
# @app.get("/api/check_reserves/", response_model=list[schemas.Reservation])
# @app.get("/api/check_reserves/", response_model=list[schemas.Reservation])
# @app.post("/api/create_reservation/", response_model=schemas.Reservation)
# @app.get("/api/courts/", response_model=list[schemas.Court])
# @app.get("/api/courts/{court_id}", response_model=schemas.Court)
# @app.post("/api/create_court/", response_model=schemas.Court)
# @app.get("/api/events/upcoming")
# @app.post("/api/events/register")
# @app.get("/api/dashboard")
# @app.get("/api/events")
# @app.get("/{full_path:path}")

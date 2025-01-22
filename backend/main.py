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

#  get all users
@app.get("/api/users/", response_model=list[schemas.User])
async def read_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    return crud.get_users(db)

@app.post("/api/login/")
async def login(user: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
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
    if current_user:
        return {
            "id": current_user.id,
            "email": current_user.email,
            "role": current_user.role,
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

@app.post("/api/signup/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # First check if user with given email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return crud.create_user(db=db, user=user)

@app.post("/api/signup/employee", response_model=schemas.User)
def create_employee(user: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    return crud.create_employee(db=db, user=user)

@app.post("/api/signup/manager", response_model=schemas.User)
async def create_manager(
    user: schemas.ManagerCreate, 
    db: Session = Depends(get_db)
):
    try:
        db_user = crud.get_user_by_email(db, email=user.email)
        if db_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        return crud.create_manager(db=db, user=user)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@app.get("/api/reserves_by_day/{court_id}", response_model=list[schemas.Reservation])
def read_reserves_by_day(
    court_id: int,
    date_time: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Get all reservations for specific court on the given day
    """
    try:
        parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")
    
    # Verify court exists
    court = crud.get_court_by_id(db, court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    
    reservations = crud.get_reserves_by_day(db, court_id=court_id, start_date_time=parsed_date)
    return reservations

@app.get("/api/all-reserves/", response_model=list[schemas.Reservation])
def read_all_reserves(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all reservations (manager only)
    """
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    return crud.get_all_reserves(db)

@app.get("/api/reserves_current_user/", response_model=list[schemas.Reservation])
def read_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    
    """
    Get all reservations for the currently logged in user
    """
    reservations = crud.get_reserves_by_id(db, user_id=current_user.id)
    return reservations


@app.get("/api/current_reserves/", response_model=list[schemas.Reservation])
def read_current_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all current and future reservations for the logged in user
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    reservations = crud.get_current_reserves_by_id(db, user_id=current_user.id)
    return reservations

@app.get("/api/past_reserves/", response_model=list[schemas.Reservation])
def read_past_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get all past reservations for the logged in user
    """
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    reservations = crud.get_past_reserves_by_id(db, user_id=current_user.id)
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
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if court exists
    court = crud.get_court_by_id(db, court_id=reservation.court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")

    # Check for existing reservations
    same_reserves = crud.get_check_reserves(
        db=db, 
        court_id=reservation.court_id,
        start_date_time=reservation.start_date_time
    )
    if same_reserves:
        raise HTTPException(
            status_code=400, 
            detail="Reservation already exists for this time slot"
        )
    
    return crud.create_user_reservation(
        db=db, 
        reservation=reservation, 
        user_id=current_user.id
    )

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

@app.delete("/api/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if crud.delete_user(db, user_id):
        return {"message": "User deleted successfully"}
    raise HTTPException(status_code=404, detail="User not found")

@app.put("/api/users/{user_id}", response_model=schemas.User)
async def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    user = crud.update_user(db, user_id, user_data)
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")

@app.get("/api/employees/tasks/{employee_id}")
async def get_employee_tasks(
    employee_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return crud.get_employee_tasks_by_id(db, employee_id)

@app.post("/api/employees/{employee_id}/tasks")
async def assign_task(
    employee_id: int,
    task: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return crud.assign_task(db=db, task=task, employee_id=employee_id)

@app.put("/api/tasks/{task_id}", response_model=schemas.Task)
async def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or current_user.role != models.RoleEnum.MANAGER:
        raise HTTPException(status_code=403, detail="Access denied")
    
    task = crud.update_task(db, task_id, task_data.model_dump(exclude_unset=True))
    if task:
        return task
    raise HTTPException(status_code=404, detail="Task not found")

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

@app.get("/api/courts/{court_id}", response_model=schemas.Court)
async def get_court_details(
    court_id: int,
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    """Get specific court details"""
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")
    
    court = crud.get_court_by_id(db, court_id=court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    
    return court

# @app.post("/api/create_court/", response_model=schemas.Court)
# async def create_court(
#     court: schemas.CourtBase,
#     current_user: models.User = Depends(get_current_user), 
#     db: Session = Depends(get_db)
# ):
#     if not current_user or current_user.role not in [models.RoleEnum.MANAGER, models.RoleEnum.EMPLOYEE]:
#         raise HTTPException(status_code=403, detail="Access denied")
    
#     db_court = models.Court(
#         court_name=court.court_name,
#         court_type=court.court_type,
#         capacity=court.capacity,
#         hourly_rate=court.hourly_rate
#     )
    
#     db.add(db_court)
#     db.commit()
#     db.refresh(db_court)
#     return db_court

@app.post("/api/courts/", response_model=schemas.Court)
async def create_court(
    court: schemas.CourtCreate,
    db: Session = Depends(get_db)
):
    return crud.create_court(db=db, court=court)

@app.get("/api/dashboard")
async def get_dashboard(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=403, detail="Not authenticated")

    # Role-based dashboard responses
    if current_user.role == models.RoleEnum.MANAGER:
        # MANAGER gets full dashboard with all statistics
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

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
from fastapi import Depends, FastAPI, HTTPException, Query, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine, Base
from dotenv import load_dotenv  # Import load_dotenv
import os  # Import os to access environment variables


# This line ensures that tables are created if they don’t exist
Base.metadata.create_all(bind=engine)
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



# @app.post("/api/login/")
# async def login(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid email or password")
    
#     # Create access token
#     access_token = create_access_token(
#         data={"sub": str(db_user.id)}
#     )
    
#     # Set cookie with the token
#     response.set_cookie(
#         key="token",
#         value=access_token,
#         httponly=True,
#         secure=True,  # Change this to False if not using HTTPS in development
#         samesite="lax",
#         max_age=24*60*60*100
#     )
    
#     # Make sure we're returning user data in the expected format
#     return {
#         "message": "Successfully logged in",
#         "user": {
#             "id": db_user.id,
#             "email": db_user.email,
#             "is_active": db_user.is_active,
#             "is_superuser": db_user.is_superuser
#         }
#     }
    
# @app.get("/api/users/", response_model=list[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users

@app.post("/api/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # First check if user with given email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    return crud.create_user(db=db, user=user)


@app.get("/api/reserves/", response_model=list[schemas.Reservation])
def read_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    # reserves = crud.get_reserves_by_id(db, user_id=user_id)
    # return reserves
    
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
    
    reserves = crud.get_check_reserves(db, date_time=parsed_date)
    if not reserves:
        raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
    return reserves

@app.post("/api/users/create_reserves/", response_model=schemas.Reservation)
async def create_reservation_for_user(
    reservation: schemas.ReservationCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure the user does not already have a reservation at the specified date and time
    same_reserves = crud.get_check_reserves(db=db, date_time=reservation.date_time)
    if same_reserves:
        raise HTTPException(status_code=400, detail="Reservation already exists for this time slot")
    
    return crud.create_user_Reservation(db=db, Reservation=reservation, user_id=current_user.id)

# @app.post("/api/logout/")
# async def logout(response: Response):
#     response.delete_cookie(key="token")
#     return {"message": "Successfully logged out"}

@app.get("/api/superuser/dashboard")
async def get_superuser_dashboard(
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # Check if user is a superuser
    if not current_user or not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Access denied")

    # Fetch dashboard statistics
    total_users = crud.get_total_users_count(db)
    active_users = crud.get_active_users_count(db)
    total_reservations = crud.get_total_reservations_count(db)
    month_reservations = crud.get_month_reservations_count(db)
    total_revenue = crud.calculate_total_revenue(db)
    month_revenue = crud.calculate_month_revenue(db)
    
    # Prepare reservation trends data
    reservation_trends = crud.get_reservation_trends(db)

    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "totalReservations": total_reservations,
        "monthReservations": month_reservations,
        "totalRevenue": total_revenue,
        "monthRevenue": month_revenue,
        "reservationTrends": reservation_trends
    }

@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

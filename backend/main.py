# from fastapi import Depends, FastAPI, HTTPException, Query
# from fastapi.staticfiles import StaticFiles
# from fastapi.responses import FileResponse
# from sqlalchemy.orm import Session
# from datetime import datetime
# from . import crud, models, schemas
# from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
# from .database import SessionLocal, engine
# import os

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# # Enable CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # Allow requests from the frontend origin
#     allow_credentials=True,
#     allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
#     allow_headers=["*"],  # Allow all headers
# )

# # Serve React App
# app.mount("/public", StaticFiles(directory="frontend/public"), name="public")


# # Dependency
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()




# # API routes
# @app.post("/api/users/", response_model=schemas.User)
# def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return crud.create_user(db=db, user=user)

# # Login endpoint
# @app.post("/api/login/", response_model=schemas.User)
# def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     # Retrieve user by email
#     db_user = crud.get_user_by_email(db, email=user.email)

#     # Check if user exists and verify password
#     if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
#         raise HTTPException(status_code=400, detail="Invalid email or password")
    
#     # Return user data excluding sensitive information (like password)
#     return schemas.User(id=db_user.id, email=db_user.email, is_active=db_user.is_active, reservor=db_user.reserves)

# # @app.get("/api/users/", response_model=list[schemas.User])
# # def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
# #     users = crud.get_users(db, skip=skip, limit=limit)
# #     return users

# @app.get("/api/users/{user_id}", response_model=schemas.User)
# def read_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = crud.get_user(db, user_id=user_id)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user

# # @app.post("/api/users/{user_id}/reserves/", response_model=schemas.Reservation)

# @app.post("/api/create_reserves/", response_model=schemas.Reservation)
# def create_Reservation_for_user(
#     user_id: int, Reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
# ):
#     same_reserves = crud.get_check_reserves(db=db, date_time=Reservation.date_time)
#     if not same_reserves:
#         return crud.create_user_reservation(db=db, Reservation=Reservation, user_id=user_id)
#     else:
#         raise HTTPException(status_code=400, detail="Reservation already exists")

# @app.get("/api/reserves/", response_model=list[schemas.Reservation])
# def read_reserves(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     reserves = crud.get_reserves(db, skip=skip, limit=limit)
#     return reserves

# @app.get("/api/check_reserves/", response_model=list[schemas.Reservation])
# def check_reserves(date_time: str = Query(...), db: Session = Depends(get_db)):
#     try:
#         parsed_date = datetime.fromisoformat(date_time.replace('Z', '+00:00'))
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid date format")
    
#     reserves = crud.get_check_reserves(db, date_time=parsed_date)
#     if not reserves:
#         raise HTTPException(status_code=404, detail="No reservations found for the given date and time")
#     return reserves

# @app.get("/{full_path:path}")
# async def serve_react(full_path: str):
#     if full_path.startswith("api"):
#         raise HTTPException(status_code=404, detail="API route not found")
#     return FileResponse("frontend/build/index.html")

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



# main.py
from fastapi import Depends, FastAPI, HTTPException, Query, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine
from dotenv import load_dotenv  # Import load_dotenv
import os  # Import os to access environment variables

# Load environment variables from .env file
load_dotenv()
# ... other imports ...

app = FastAPI()

# Update CORS middleware to allow credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key for JWT - in production, store this in environment variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")  # Use a default for development only
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dependency
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
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )
        
        # Verify user exists in database
        user = crud.get_user(db, user_id=int(user_id))
        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )
        return int(user_id)
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



@app.post("/api/login/")
async def login(user: schemas.UserCreate, response: Response, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(db_user.id)}
    )
    
    # Set cookie with the token
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=True,  # Change this to False if not using HTTPS in development
        samesite="lax",
        max_age=1800
    )
    
    # Make sure we're returning user data in the expected format
    return {
        "message": "Successfully logged in",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "is_active": db_user.is_active
        }
    }
    
# @app.get("/api/users/", response_model=list[schemas.User])
# def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_users(db, skip=skip, limit=limit)
#     return users

@app.get("/api/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# @app.post("/api/users/{user_id}/reserves/", response_model=schemas.Reservation)

@app.post("/api/create_reserves/", response_model=schemas.Reservation)
def create_Reservation_for_user(
    user_id: int, Reservation: schemas.ReservationCreate, db: Session = Depends(get_db)
):
    same_reserves = crud.get_check_reserves(db=db, date_time=Reservation.date_time)
    if not same_reserves:
        return crud.create_user_reservation(db=db, Reservation=Reservation, user_id=user_id)
    else:
        raise HTTPException(status_code=400, detail="Reservation already exists")

@app.get("/api/reserves/", response_model=list[schemas.Reservation])
def read_reserves(current_user: int = Depends(get_current_user), db: Session = Depends(get_db)):
    # reserves = crud.get_reserves_by_id(db, user_id=user_id)
    # return reserves
    
    """
    Get all reservations for the currently logged in user
    """
    reservations = crud.get_reserves_by_id(db, user_id=current_user)
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


# @app.post("/api/users/{user_id}/reserves/", response_model=schemas.Reservation)
# async def create_reservation_for_user(
#     user_id: int,
#     reservation: schemas.ReservationCreate,
#     current_user: int = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     # Verify that the current user is creating their own reservation
#     if current_user != user_id:
#         raise HTTPException(status_code=403, detail="Not authorized to create reservations for other users")
    
#     # Check for existing reservations
#     same_reserves = crud.get_check_reserves(db=db, date_time=reservation.date_time)
#     if same_reserves:
#         raise HTTPException(status_code=400, detail="Reservation already exists for this time slot")
    
#     return crud.create_user_Reservation(db=db, Reservation=reservation, user_id=user_id)


@app.post("/api/users/me/reserves/", response_model=schemas.Reservation)
async def create_reservation_for_user(
    reservation: schemas.ReservationCreate,
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure the user does not already have a reservation at the specified date and time
    same_reserves = crud.get_check_reserves(db=db, date_time=reservation.date_time)
    if same_reserves:
        raise HTTPException(status_code=400, detail="Reservation already exists for this time slot")
    
    return crud.create_user_Reservation(db=db, Reservation=reservation, user_id=current_user)

@app.post("/api/logout/")
async def logout(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Successfully logged out"}



@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("frontend/build/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

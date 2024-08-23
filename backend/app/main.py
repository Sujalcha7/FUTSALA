from fastapi import FastAPI, APIRouter

# We instantiate a FastAPI app object, which is a Python class that provides all the functionality for your API.
# FastAPI is a class
# app is an object
app = FastAPI(title="FUTSALA API", openapi_url="/openapi.json")

# We instantiate an APIRouter which is how we can group our API endpoints (and specify versions and other config which we will look at later)
api_router = APIRouter()

# By adding the @api_router.get("/", status_code=200) decorator to the root function, we define a basic GET endpoint for our API.
@api_router.get("/", status_code=200)
def root() -> dict:
    """
    Root GET
    """
    return {"msg": "Hello, World! This is FUTSALA"}

# We use the include_router method of the app object to register the router we created in step 2 on the FastAPI object.
app.include_router(api_router)

# The __name__ == "__main__" conditional applies when a module is called directly, i.e. if we run python app/main.py. In this scenario, we need to import uvicorn since FastAPI depends on this web server (which we’ll talk more about later)
if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")

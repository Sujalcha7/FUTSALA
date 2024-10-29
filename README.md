# FUTSALA
A simple web based application for futsal booking managements.

## Installation
### Running fastapi server

1.  Create virtual environment using `python -m venv env_name` and activate it `env_name\scripts\activate`.
2.  Install all dependencies listed in `requirements.txt`:
```bash
pip install -r requirements.txt
```
3.  Run the server
```bash
uvicorn backend.main:app --reload
```
4. Open http://localhost:8001/docs

To stop the server, press CTRL+C

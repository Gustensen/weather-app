# Today's Task -> Connect FastAPI to your DB and get a successful "Current Weather" API call working.
from fastapi import FastAPI


app = FastAPI()

app.get("/")
def hello_world():
    return {"message": "Hello World"}


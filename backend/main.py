from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Nexis backend running"}
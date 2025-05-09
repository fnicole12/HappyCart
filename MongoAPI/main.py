from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os


load_dotenv()   #variables de entorno
app = FastAPI()     #incializa instancia FastAPI

#Conexion a MongoDB
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.Cluster0

#prueba
@app.get("/")
def home():
    return {"message": "I'ts me"}, {"status": 200}

#uvicorn main:app --reload
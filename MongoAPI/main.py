from fastapi import FastAPI
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel
import os

load_dotenv()   #variables de entorno
app = FastAPI()     #incializa instancia FastAPI

#Conexion al cluster
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client.happycart

# #prueba
# @app.get("/test")
# def home():
#     return {"message": "I'ts me"}, {"status": 200}

####################################################################################################################
#modelos de datos
class UserLogin(BaseModel):
    email: str
    password: str

####################################################################################################################
#login
@app.post("/login")
async def login(user: UserLogin):
    user_found = await db.users.find_one({"email": user.email, "password": user.password})

    if user_found:
        return JSONResponse(content={"message": "Login exitoso"}, status_code=200)
    else:
        return JSONResponse(content={"detail": "Credenciales inválidas"}, status_code=401)

# uvicorn main:app --reload --host 0.0.0.0
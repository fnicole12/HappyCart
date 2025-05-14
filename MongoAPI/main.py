from fastapi import FastAPI
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import uuid

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
    phone: str
    password: str

class UserSigin(BaseModel):
    name: str
    phone: str
    password: str
    create_new: bool
    family_id: str = None #opcional

####################################################################################################################
#login
@app.post("/login")
async def login(user: UserLogin):
    user_found = await db.users.find_one({"phone": user.phone, "password": user.password})

    if user_found:
        return JSONResponse(content={"message": "Login exitoso"}, status_code=200)
    else:
        return JSONResponse(content={"detail": "Credenciales inválidas"}, status_code=401)
    
#signup
@app.post("/signup")
async def signup(user: UserSigin):
    existing_user = await db.users.find_one({"phone": user.phone})
    if existing_user:
        return JSONResponse(content={"detail": "El número de teléfono ya está registrado"}, status_code=400)
    
    #crear familia
    if user.create_new:
        family_id = uuid.uuid4().hex[:6].upper() #generador de id
        await db.families.insert_one({
            "_id": family_id,
            "name": f"Familia de {user.name}",
            "members": [user.phone]
        })
    else:
    #unirse a familia
        family = await db.families.find_one({"_id": user.family_id})
        if not family:
            return JSONResponse(content={"detail": "Código de familia no encontrado"}, status_code=404)
        
        family_id = family["_id"]
        await db.families.update_one(
            {"_id": family_id},
            {"$push": {"members": user.phone}}
        )
    
    #crear usuario
    await db.users.insert_one({"phone": user.phone, "name": user.name, "password": user.password, "family_id": family_id})
    return JSONResponse(content={"message": "Registro exitoso", "family_id": family_id}, status_code=201)
    


# uvicorn main:app --reload --host 0.0.0.0
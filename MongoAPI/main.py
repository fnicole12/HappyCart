from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel
from datetime import datetime, timezone
from bson import ObjectId
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

class NewList(BaseModel):
    family_id: str
    phone: str
    title: str
    products: list = []

####################################################################################################################
#login
@app.post("/login")
async def login(user: UserLogin):
    user_found = await db.users.find_one({"phone": user.phone, "password": user.password})

    if user_found:
        return JSONResponse(content={
        "message": "Login exitoso",
        "family_id": user_found["family_id"],
        "phone": user_found["phone"],
        "name": user_found["name"]
        }, status_code=200)
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

#new list
@app.post("/lists")
async def new_list(new_list: NewList):
    result = await db.lists.insert_one({
        "family_id": new_list.family_id,
        "phone": new_list.phone,
        "title": new_list.title,
        "products": new_list.products,
        "creation_date": datetime.now(timezone.utc).isoformat()
    })
    return JSONResponse(content={"message": "Lista creada", "list_id": str(result.inserted_id)}, status_code=201)

#show lists
@app.get("/lists")
async def get_lists(family_id: str = Query(...)):
    listas = []
    #busca todas las listas de la familia
    async for lista in db.lists.find({"family_id": family_id}):
        lista["_id"] = str(lista["_id"])        #convierte el ObjectId a string
        #busca el usuario que creo la lista
        user = await db.users.find_one({"phone": lista["phone"]})
        if user:
            lista["member"] = user["name"]
        else:
            lista["member"] = "Desconocido"
            
        listas.append(lista)
    return {"lists": listas}

#update list
@app.put("/lists/{list_id}")
async def update_list(list_id: str, updated: dict):
    result = await db.lists.update_one(
        {"_id": ObjectId(list_id)},     #de string a ObjectId   
        {"$set": updated}       #solo actualiza los campos que se envian
    )
    if result.modified_count:
        return {"message": "Lista actualizada"}
    else:
        return JSONResponse(content={"detail": "List no encontrada"}, status_code=404)


# uvicorn main:app --reload --host 0.0.0.0
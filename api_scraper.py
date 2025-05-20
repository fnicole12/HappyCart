from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import json
import os

app = FastAPI()

class RecetaRequest(BaseModel):
    nombre: str

@app.post("/scrapear/")
def scrapear_receta(req: RecetaRequest):
    output_path = "ingredientes/resultado.json"

    #eliminar archivo anterior
    if os.path.exists(output_path):
        os.remove(output_path)

    #ejecutar Scrapy
    result = subprocess.run(
        [
            "scrapy", "crawl", "receta",
            "-a", f"receta={req.nombre}",
            "-o", "resultado.json:jsonlines"
        ],
        cwd="./ingredientes",
        capture_output=True,
        text=True
    )

    try:
        with open(output_path, "r", encoding="utf-8") as f:
            first_line = f.readline()
            if not first_line.strip():
                return {"error": "Sin resultados"}
            data = json.loads(first_line)
            return {"ingredientes": data.get("ingredientes", [])}
    except Exception as e:
        return {"error": str(e)}

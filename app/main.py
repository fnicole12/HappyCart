from fastapi import FastAPI
from pydantic import BaseModel
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from ingredientes_buscar.ingredientes_buscar.spiders.ing_busc import RecetaSpider



app = FastAPI()

class RecetaRequest(BaseModel):
    nombre: str

@app.post("/buscar-receta/")
def buscar_receta(req: RecetaRequest):
    results = []

    class MiSpider(RecetaSpider):
        def parse(self, response):
            results.append({
                'titulo': response.css('h1.entry-title::text').get(),
                'ingredientes': response.css('div.ingredients-list li::text').getall(),
                'instrucciones': response.css('div.instructions ol li::text').getall(),
            })

    process = CrawlerProcess(get_project_settings())
    process.crawl(MiSpider, nombre=req.nombre.strip().lower().replace(" ", "-"))
    process.start()

    return {"receta": results[0] if results else None}

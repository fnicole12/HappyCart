import scrapy
import re

class RecetaSpider(scrapy.Spider):
    name = "receta"
    allowed_domains = ["recetasnestle.com.mx"]

    def __init__(self, receta=None, *args, **kwargs):
        super(RecetaSpider, self).__init__(*args, **kwargs)
        self.start_urls = [f"https://www.recetasnestle.com.mx/busca/resultado?q={receta}"]

    def parse(self, response):
        url = response.css('a.cardRecipe::attr(href)').get()
        if url:
            yield scrapy.Request(response.urljoin(url), callback=self.parse_receta)

    def parse_receta(self, response):
        etiquetas = response.css('label.checkDone')
        ingredientes = []

        for e in etiquetas:
            texto = scrapy.Selector(text=e.get()).xpath('string()').get()
            limpio = re.sub(r'^\s*\d+([½¼¾⅓⅔\/.\d\s]*)?', '', texto.strip())
            if limpio:
                ingredientes.append(limpio.strip())

        yield {
            "url": response.url,
            "ingredientes": ingredientes
        }

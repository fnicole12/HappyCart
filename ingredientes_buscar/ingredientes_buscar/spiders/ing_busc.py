import scrapy
from scrapy_splash import SplashRequest


class RecetaSpider(scrapy.Spider):
    name = "receta_spider"

    custom_settings = {
        "DOWNLOAD_HANDLERS": {
            "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
            "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
        },
        "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
        "PLAYWRIGHT_BROWSER_TYPE": "chromium",
    }

    def __init__(self, nombre=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        slug = nombre.strip().lower().replace(" ", "-")
        self.start_urls = [f"https://www.vvsupremo.com/recipe/{slug}"]

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, meta={"playwright": True, "playwright_include_page": True, "playwright_page_methods": [
                {"method": "wait_for_timeout", "args": [3000]}  # espera 3 segundos
            ]}, callback=self.parse)

    def parse(self, response):
        titulo = response.css('h1.entry-title::text').get()
        ingredientes = response.css('div.ingredient-det::text').getall()
        instrucciones = response.css('div.instructions ol li::text').getall()

        yield {
            'titulo': titulo,
            'ingredientes': ingredientes,
            'instrucciones': instrucciones,
        }


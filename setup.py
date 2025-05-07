from setuptools import setup, find_packages

setup(
    name="proyecto_cm",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "scrapy"
    ],
)

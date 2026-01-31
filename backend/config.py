import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '7115664c7e335bb08e789766853496e7193578714c837919ad50d086c76c48c6')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://postgres:1221@localhost/ai_software_architect')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBAPFWizhV4xjVyaOu1fgGkK3oBIV1IzhQ')
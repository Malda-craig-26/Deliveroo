import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') 
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = int (os.getenv('JWT_ACCESS_TOKEN_EXPIRES',3600))  # 1 hour
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
# SQLALCHEMY_URI and SECRET_KEY should be set in the .env file
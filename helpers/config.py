from pydantic_settings import BaseSettings

class Settings(BaseSettings):

  GEMINI_API_KEY:str
  MISTRAL_API_KEY:str
  
  
  class Config:
    env_file = ".env"
    
def get_settings():
  return Settings()
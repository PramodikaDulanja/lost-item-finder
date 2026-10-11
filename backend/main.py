import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.dialects.postgresql import ARRAY

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Table
class DBItemReport(Base):
    __tablename__ = "lost_items"
    
    id = Column(Integer, primary_key=True, index=True)
    item_type = Column(String, index=True) # "lost" or "found"
    item_name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    date_lost = Column(String)
    image_urls = Column(ARRAY(String))

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Lost Item Network API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schema matching frontend payload
class ItemReport(BaseModel):
    itemType: str # "lost" or "found"
    itemName: str
    category: str
    description: str
    location: str
    dateLost: str
    imageUrls: List[str]

# Shared endpoint for both lost and found items
@app.post("/api/items")
def submit_item_report(report: ItemReport, db: Session = Depends(get_db)):
    try:
        new_item = DBItemReport(
            item_type=report.itemType,
            item_name=report.itemName,
            category=report.category,
            description=report.description,
            location=report.location,
            date_lost=report.dateLost,
            image_urls=report.imageUrls
        )
        
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        
        return {
            "status": "success",
            "message": f"Successfully saved {report.itemType} item to PostgreSQL!",
            "id": new_item.id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
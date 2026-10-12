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

# Added connection pooling to prevent connection drops
engine = create_engine(os.getenv("DATABASE_URL"), pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 1. SEPARATE DATABASE TABLES ---

class DBLostItem(Base):
    __tablename__ = "lost_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    item_name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    date_lost = Column(String)
    image_urls = Column(ARRAY(String))

class DBFoundItem(Base):
    __tablename__ = "found_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    item_name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    location = Column(String)
    date_found = Column(String) # Renamed to fit the found context
    image_urls = Column(ARRAY(String))

# Create both tables in Neon
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

# --- 2. SEPARATE PYDANTIC SCHEMAS ---

class LostItemReport(BaseModel):
    userId: str
    itemName: str
    category: str
    description: str
    location: str
    dateLost: str
    imageUrls: List[str]

class FoundItemReport(BaseModel):
    userId: str
    itemName: str
    category: str
    description: str
    location: str
    dateLost: str # Keeping as dateLost here just to match your current frontend payload
    imageUrls: List[str]

# --- 3. SEPARATE API ENDPOINTS ---

@app.post("/api/items/lost")
def submit_lost_report(report: LostItemReport, db: Session = Depends(get_db)):
    try:
        new_item = DBLostItem(
            user_id=report.userId,
            item_name=report.itemName,
            category=report.category,
            description=report.description,
            location=report.location,
            date_lost=report.dateLost,
            image_urls=report.imageUrls
        )
        db.add(new_item)
        db.commit()
        return {"status": "success", "message": "Lost item saved!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/items/found")
def submit_found_report(report: FoundItemReport, db: Session = Depends(get_db)):
    try:
        new_item = DBFoundItem(
            user_id=report.userId,
            item_name=report.itemName,
            category=report.category,
            description=report.description,
            location=report.location,
            date_found=report.dateLost, # Map frontend 'dateLost' to backend 'date_found'
            image_urls=report.imageUrls
        )
        db.add(new_item)
        db.commit()
        return {"status": "success", "message": "Found item saved!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
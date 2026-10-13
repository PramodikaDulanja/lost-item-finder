import os
from fastapi import FastAPI, HTTPException, Depends, UploadFile,  File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.dialects.postgresql import ARRAY

from typing import Optional
import shutil
import json
import cloudinary
import cloudinary.uploader

import cloudinary.api

# Load environment variables from the .env file
load_dotenv()

# Configure Cloudinary using the loaded credentials
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)


# Added connection pooling to prevent connection drops
engine = create_engine(os.getenv("DATABASE_URL"),
                       pool_pre_ping=True, pool_recycle=300)
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
    date_found = Column(String)  # Renamed to fit the found context
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
    # allow_origins=["*"],
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
    dateLost: str  # Keeping as dateLost here just to match your current frontend payload
    imageUrls: List[str]

# --- 3. SEPARATE API ENDPOINTS ---


# Add this near your other Pydantic models (like UserCreate)
class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None


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
        db.refresh(new_item)
        return {"status": "success", "message": "Lost item saved!", "id": new_item.id}
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
            date_found=report.dateLost,  # Map frontend 'dateLost' to backend 'date_found'
            image_urls=report.imageUrls
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return {"status": "success", "message": "Found item saved!", "id": new_item.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/items/lost/{item_id}")
def get_lost_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(DBLostItem).filter(DBLostItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.get("/api/items/found/{item_id}")
def get_found_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(DBFoundItem).filter(DBFoundItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.get("/api/items")
def get_all_items(db: Session = Depends(get_db)):
    try:
        lost_items = db.query(DBLostItem).all()
        found_items = db.query(DBFoundItem).all()

        feed = []
        for item in lost_items:
            feed.append({
                "id": item.id,
                "type": "lost",
                "itemName": item.item_name,
                "category": item.category,
                "description": item.description,
                "location": item.location,
                "date": item.date_lost,
                "image": item.image_urls[0] if item.image_urls else None
            })

        for item in found_items:
            feed.append({
                "id": item.id,
                "type": "found",
                "itemName": item.item_name,
                "description": item.description,
                "category": item.category,
                "location": item.location,
                "date": item.date_found,
                "image": item.image_urls[0] if item.image_urls else None
            })

        # Sort newest first
        feed.sort(key=lambda x: x["date"], reverse=True)
        return feed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/users/{user_id}/items")
def get_user_items(user_id: str, db: Session = Depends(get_db)):
    try:
        lost = db.query(DBLostItem).filter(DBLostItem.user_id == user_id).all()
        found = db.query(DBFoundItem).filter(
            DBFoundItem.user_id == user_id).all()

        feed = []
        for item in lost:
            feed.append({
                "id": item.id, "type": "lost", "itemName": item.item_name,
                "category": item.category, "location": item.location,
                "date": item.date_lost, "image": item.image_urls[0] if item.image_urls else None
            })

        for item in found:
            feed.append({
                "id": item.id, "type": "found", "itemName": item.item_name,
                "category": item.category, "location": item.location,
                "date": item.date_found, "image": item.image_urls[0] if item.image_urls else None
            })

        feed.sort(key=lambda x: x["date"], reverse=True)
        return feed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/items/{item_type}/{item_id}")
def delete_item(item_type: str, item_id: int, db: Session = Depends(get_db)):
    try:
        if item_type == "lost":
            item = db.query(DBLostItem).filter(
                DBLostItem.id == item_id).first()
        elif item_type == "found":
            item = db.query(DBFoundItem).filter(
                DBFoundItem.id == item_id).first()
        else:
            raise HTTPException(status_code=400, detail="Invalid item type")

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        db.delete(item)
        db.commit()
        return {"status": "success", "message": "Item deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/items/{item_type}/{item_id}")
async def update_item(
    item_type: str,
    item_id: int,
    item_name: str = Form(None),
    category: str = Form(None),
    location: str = Form(None),
    description: str = Form(None),
    retained_images: str = Form("[]"),
    new_images: List[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        if item_type == "lost":
            item = db.query(DBLostItem).filter(
                DBLostItem.id == item_id).first()
        elif item_type == "found":
            item = db.query(DBFoundItem).filter(
                DBFoundItem.id == item_id).first()
        else:
            raise HTTPException(status_code=400, detail="Invalid item type")

        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        if item_name:
            item.item_name = item_name
        if category:
            item.category = category
        if location:
            item.location = location
        if description:
            item.description = description

        # 1. Parse the images the user chose to keep
        try:
            kept_urls = json.loads(retained_images)
        except:
            kept_urls = []

        # 2. Upload newly added images to Cloudinary
        uploaded_urls = []
        if new_images:
            for img in new_images:
                if img.filename:
                    # Upload directly to Cloudinary instead of a local folder
                    result = cloudinary.uploader.upload(img.file)
                    uploaded_urls.append(result.get("secure_url"))

        # 3. Combine kept existing images with new Cloudinary URLs
        item.image_urls = kept_urls + uploaded_urls

        db.commit()
        return {"status": "success", "message": "Item updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

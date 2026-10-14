import os
import firebase_admin
from firebase_admin import credentials, auth
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# 1. Load Environment Variables (for Neon DB URL)
load_dotenv()

# 2. Setup Neon Database Connection
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    contact_number = Column(String)


# 3. Initialize Firebase Admin
# Make sure your downloaded JSON key is in the same folder and named correctly
cred = credentials.Certificate("firebase-credentials.json")
firebase_admin.initialize_app(cred)


def sync_existing_users():
    db = SessionLocal()

    print("Fetching users from Firebase...")
    # Fetch all users from Firebase Auth
    # (Handles up to 1000 users at once)
    page = auth.list_users()

    added_count = 0
    skipped_count = 0

    for user in page.users:
        # Check if user already exists in Neon
        existing_user = db.query(DBUser).filter(
            DBUser.firebase_uid == user.uid).first()

        if existing_user:
            skipped_count += 1
            continue

        # Create new user record in Neon
        new_user = DBUser(
            firebase_uid=user.uid,
            name=user.display_name or "Unknown User",
            email=user.email or "",
            contact_number="Not provided"  # Placeholder for older users
        )
        db.add(new_user)
        added_count += 1

    db.commit()
    db.close()

    print(f"Sync complete!")
    print(f"Successfully added: {added_count} users to Neon.")
    print(f"Skipped (already existed): {skipped_count} users.")


if __name__ == "__main__":
    sync_existing_users()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import  List, Optional

from .database import engine, Base, get_db
from . import models, schemas, auth

# Initialize the DB Tabels
Base.metadata.create_all(bind = engine)

app = FastAPI(title="M's Snacks API")

# Ccofigure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_headers = ["*"],
    allow_methods = ["*"],
)

# ---Public Endpoints---
@app.get("/api/categories", response_model=List[schemas.CategoryOut])
def get_categories(db : Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.get("/api/snacks", response_model=List[schemas.SnackOut])
def get_snacks(category_id : Optional[int] = None, db : Session = Depends(get_db)):
    query = db.query(models.Snack)
    if category_id:
        query = query.filter(models.Snack.category_id == category_id)
    return query.all()

# ---Admin Auth Endpoint---

@app.post("/api/admin/login", response_model=schemas.Token)
def login(form_data : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Incorrect username or password",
            headers = {"WWW-Authenticate" : "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token" : access_token, "token_type" : "bearer"}

# Seed admin account endpoint helper (Remove or secure this execution strategy in raw production environments)
@app.post("/api/admin/register-seed-setup", status_code=status.HTTP_201_CREATED)
def seed_admin(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    exists = db.query(models.User).first()
    if exists:
        raise HTTPException(status_code=400, detail="Admin already initialised.")
    hashed = auth.get_password_hash(form_data.password)
    new_user = models.User(username=form_data.username, password_hash=hashed)
    db.add(new_user)
    db.commit()
    return {"msg": "Seed administrator account verified successfully"}

# --- PROTECTED ADMIN CRUD ENDPOINTS ---

@app.post("/api/categories", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    existing = db.query(models.Category).filter(models.Category.name == category.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    db_category = models.Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.post("/api/snacks", response_model=schemas.SnackOut, status_code=status.HTTP_201_CREATED)
def create_snack(snack: schemas.SnackCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_snack = models.Snack(**snack.model_dump())
    db.add(db_snack)
    db.commit()
    db.refresh(db_snack)
    return db_snack

@app.put("/api/snacks/{id}", response_model=schemas.SnackOut)
def update_snack(id: int, updated_snack: schemas.SnackCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    snack_query = db.query(models.Snack).filter(models.Snack.id == id)
    snack = snack_query.first()
    if not snack:
        raise HTTPException(status_code=404, detail="Snack not found")
    
    snack_query.update(updated_snack.model_dump(), synchronize_session=False)
    db.commit()
    return snack_query.first()

@app.delete("/api/snacks/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_snack(id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    snack_query = db.query(models.Snack).filter(models.Snack.id == id)
    snack = snack_query.first()
    if not snack:
        raise HTTPException(status_code=404, detail="Snack not found")
    
    snack_query.delete(synchronize_session=False)
    db.commit()
    return None
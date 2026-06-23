from pydantic import BaseModel
from typing import Optional, List

#Token Schemas
class Token(BaseModel):
    access_token : str
    token_type : str

class TokenData(BaseModel):
    username : Optional[str] = None

#Category Schemas
class CategoryBase(BaseModel):
    name : str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id : int
    class Config:
        from_attributes = True

#Snack Schemas
class SnackBase(BaseModel):
    title : str
    price : float
    caption : Optional[str] = None
    image_url : Optional[str] = None
    category_id : int

class SnackCreate(SnackBase):
    pass

class SnackOut(SnackBase):
    id : int
    class Config:
        from_attributes = True
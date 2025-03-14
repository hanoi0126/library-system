from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    is_admin: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    password: str | None = None
    is_admin: bool | None = None


class UserResponse(UserBase):
    id: str
    is_admin: bool = False

    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    items: list[UserResponse]
    total: int


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBooksResponse(BaseModel):
    user_id: str
    books: list[str] = Field(..., description="List of book IDs borrowed by the user")

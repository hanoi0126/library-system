from collections.abc import Generator
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.domain.services.book import IBookRepository
from app.domain.services.user import IUserRepository
from app.infrastructures.database.connection import SessionLocal
from app.infrastructures.database.database import BookRepository, UserRepository
from app.usecase.book import BookUseCase
from app.usecase.user import UserUseCase

# JWT settings
SECRET_KEY = "your-secret-key"  # In a real app, this would be stored in an environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_book_repository(db: Annotated[Session, Depends(get_db)]) -> IBookRepository:
    return BookRepository(db)


def get_user_repository(db: Annotated[Session, Depends(get_db)]) -> IUserRepository:
    return UserRepository(db)


def get_book_usecase(
    book_repository: Annotated[IBookRepository, Depends(get_book_repository)],
) -> BookUseCase:
    return BookUseCase(book_repository)


def get_user_usecase(
    user_repository: Annotated[IUserRepository, Depends(get_user_repository)],
    book_repository: Annotated[IBookRepository, Depends(get_book_repository)],
) -> UserUseCase:
    return UserUseCase(user_repository, book_repository)


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(tz=timezone(timedelta(hours=9))) + expires_delta
    else:
        expire = datetime.now(tz=timezone(timedelta(hours=9))) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return str(encoded_jwt)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> dict[str, Any]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        is_admin: bool = payload.get("is_admin", False)
        if user_id is None or email is None:
            raise credentials_exception
    except JWTError as e:
        raise credentials_exception from e

    return {"id": user_id, "email": email, "is_admin": is_admin}


def get_current_user_admin(current_user: Annotated[dict[str, Any], Depends(get_current_user)]) -> dict[str, Any]:
    if not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user

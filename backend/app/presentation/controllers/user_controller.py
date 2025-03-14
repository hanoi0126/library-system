from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Path, status
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.presentation.dependencies import (
    create_access_token,
    get_book_usecase,
    get_current_user,
    get_current_user_admin,
    get_user_usecase,
)
from app.presentation.schemas.user import (
    TokenResponse,
    UserBooksResponse,
    UserCreate,
    UserResponse,
    UserUpdate,
)
from app.usecase.book import BookUseCase
from app.usecase.user import UserUseCase

router = APIRouter(tags=["users"])


@router.post("/api/users/register")
async def register_user(
    user_data: UserCreate,
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
) -> UserResponse:
    try:
        user = user_usecase.create_user(
            name=user_data.name,
            email=user_data.email,
            password=user_data.password,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST) from e

    return UserResponse(
        id=user.id.value,
        name=user.name.value,
        email=user.email.value,
        is_admin=user.is_admin,
    )


@router.post("/api/users/login")
async def login_user(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
) -> TokenResponse:
    user = user_usecase.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user.id.value, "email": user.email.value, "is_admin": user.is_admin}
    )

    return TokenResponse(access_token=access_token)


@router.get("/api/users/{user_id}")
async def get_user(
    user_id: Annotated[str, Path(..., description="The ID of the user to get")],
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
    current_user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> UserResponse:
    # Check if the user is requesting their own info or if they are an admin
    if user_id != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own user information unless you are an admin",
        )

    user = user_usecase.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        id=user.id.value,
        name=user.name.value,
        email=user.email.value,
        is_admin=user.is_admin,
    )


@router.put("/api/users/{user_id}")
async def update_user(
    user_data: UserUpdate,
    user_id: Annotated[str, Path(..., description="The ID of the user to update")],
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
    current_user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> UserResponse:
    # Check if the user is updating their own info or if they are an admin
    if user_id != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own user information unless you are an admin",
        )

    user = user_usecase.update_user(
        user_id=user_id,
        name=user_data.name,
        password=user_data.password,
    )

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserResponse(
        id=user.id.value,
        name=user.name.value,
        email=user.email.value,
        is_admin=user.is_admin,
    )


@router.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: Annotated[str, Path(..., description="The ID of the user to delete")],
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
    _: Annotated[dict[str, Any], Depends(get_current_user_admin)],  # Only admin can delete users
) -> JSONResponse:
    success = user_usecase.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})


@router.get("/api/users/{user_id}/books")
async def get_user_books(
    user_id: Annotated[str, Path(..., description="The ID of the user to get books for")],
    user_usecase: Annotated[UserUseCase, Depends(get_user_usecase)],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> UserBooksResponse:
    # Check if the user is requesting their own books or if they are an admin
    if user_id != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own borrowed books unless you are an admin",
        )

    # Check if the user exists
    user = user_usecase.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Get the user's books
    book_ids = user_usecase.get_user_books(user_id)

    return UserBooksResponse(
        user_id=user_id,
        books=[book_id.value for book_id in book_ids],
    )

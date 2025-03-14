from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status
from fastapi.responses import JSONResponse

from app.presentation.dependencies import get_book_usecase, get_current_user, get_current_user_admin
from app.presentation.schemas.book import (
    BookBorrowRequest,
    BookCreate,
    BookListResponse,
    BookResponse,
    BookUpdate,
)
from app.usecase.book import BookUseCase

router = APIRouter(prefix="/api/books", tags=["books"])


@router.get("")
async def get_books(
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    page: Annotated[int, Query(ge=1, description="Page number")] = 1,
    limit: Annotated[int, Query(ge=1, le=100, description="Items per page")] = 10,
    title: Annotated[str | None, Query(description="Filter by title")] = None,
) -> BookListResponse:
    books = book_usecase.get_all_books(page=page, limit=limit, title=title)
    return BookListResponse(
        items=[
            BookResponse(
                id=book.id.value,
                title=book.title.value,
                author=book.author.value,
                isbn=book.isbn.value,
                description=book.description.value if book.description else None,
                category=book.category[0].value if book.category else "",
                status=book.status.value,
                borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
            )
            for book in books
        ],
        total=len(books),  # In a real app, we would get the total count from the database
        page=page,
        limit=limit,
    )


@router.get("/{book_id}")
async def get_book(
    book_id: Annotated[str, Path(..., description="The ID of the book to get")],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
) -> BookResponse:
    book = book_usecase.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    return BookResponse(
        id=book.id.value,
        title=book.title.value,
        author=book.author.value,
        isbn=book.isbn.value,
        description=book.description.value if book.description else None,
        category=book.category[0].value if book.category else "",
        status=book.status.value,
        borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
    )


@router.post("")
async def create_book(
    book_data: BookCreate,
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user_admin: Annotated[dict[str, Any], Depends(get_current_user_admin)],  # Only admin can create books
) -> BookResponse:
    book = book_usecase.create_book(
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        description=book_data.description,
        category=book_data.category,
    )

    return BookResponse(
        id=book.id.value,
        title=book.title.value,
        author=book.author.value,
        isbn=book.isbn.value,
        description=book.description.value if book.description else None,
        category=book.category[0].value if book.category else "",
        status=book.status.value,
        borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
    )


@router.put("/{book_id}")
async def update_book(
    book_data: BookUpdate,
    book_id: Annotated[str, Path(..., description="The ID of the book to update")],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user_admin: Annotated[dict[str, Any], Depends(get_current_user_admin)],  # Only admin can update books
) -> BookResponse:
    book = book_usecase.update_book(
        book_id=book_id,
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        description=book_data.description,
        category=book_data.category,
    )

    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    return BookResponse(
        id=book.id.value,
        title=book.title.value,
        author=book.author.value,
        isbn=book.isbn.value,
        description=book.description.value if book.description else None,
        category=book.category[0].value if book.category else "",
        status=book.status.value,
        borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
    )


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(
    book_id: Annotated[str, Path(..., description="The ID of the book to delete")],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user_admin: Annotated[dict[str, Any], Depends(get_current_user_admin)],  # Only admin can delete books
) -> JSONResponse:
    success = book_usecase.delete_book(book_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})


@router.post("/{book_id}/borrow")
async def borrow_book(
    borrow_data: BookBorrowRequest,
    book_id: Annotated[str, Path(..., description="The ID of the book to borrow")],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> BookResponse:
    # Check if the user is borrowing for themselves or if they are an admin
    if borrow_data.user_id != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only borrow books for yourself unless you are an admin",
        )

    book = book_usecase.borrow_book(book_id, borrow_data.user_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book not found or not available for borrowing",
        )

    return BookResponse(
        id=book.id.value,
        title=book.title.value,
        author=book.author.value,
        isbn=book.isbn.value,
        description=book.description.value if book.description else None,
        category=book.category[0].value if book.category else "",
        status=book.status.value,
        borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
    )


@router.post("/{book_id}/return")
async def return_book(
    book_id: Annotated[str, Path(..., description="The ID of the book to return")],
    book_usecase: Annotated[BookUseCase, Depends(get_book_usecase)],
    current_user: Annotated[dict[str, Any], Depends(get_current_user)],
) -> BookResponse:
    # Get the book to check if the current user is the one who borrowed it
    book = book_usecase.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    # Check if the user is returning their own book or if they are an admin
    if book.borrowed_by and book.borrowed_by.value != current_user["id"] and not current_user["is_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only return books you have borrowed unless you are an admin",
        )

    book = book_usecase.return_book(book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Book not found or not currently borrowed",
        )

    return BookResponse(
        id=book.id.value,
        title=book.title.value,
        author=book.author.value,
        isbn=book.isbn.value,
        description=book.description.value if book.description else None,
        category=book.category[0].value if book.category else "",
        status=book.status.value,
        borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
    )

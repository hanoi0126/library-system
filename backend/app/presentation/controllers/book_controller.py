from fastapi import APIRouter, HTTPException

from app.infrastructures.repositories.book import BookRepository
from app.presentation.schemas.book import (
    BookCreateRequest,
    BookDeleteRequest,
    BookResponse,
)
from app.usecase.book import BookUseCase

router = APIRouter()

book_repository = BookRepository()
book_usecase = BookUseCase(book_repository)


@router.get("/books", response_model=list[BookResponse])
def list_books():
    books = book_usecase.find_all()
    return [BookResponse.from_domain(b) for b in books]


@router.get("/books/{book_id}", response_model=BookResponse)
def get_book(book_id: str):
    try:
        book = book_usecase.find_by_id(book_id)
        return BookResponse.from_domain(book) if book else None
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/books", response_model=BookResponse)
def create_book(req: BookCreateRequest):
    try:
        book_usecase.save(
            id=req.id,
            title=req.title,
            is_borrowed=False,
        )
        return BookResponse(id=req.id, title=req.title, is_borrowed=False)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/books/{book_id}/borrow", response_model=BookResponse)
def borrow_book(book_id: str):
    try:
        borrowed_book = book_usecase.borrow_book(book_id)
        return BookResponse.from_domain(borrowed_book)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/books/{book_id}/return", response_model=BookResponse)
def return_book(book_id: str):
    try:
        returned_book = book_usecase.return_book(book_id)
        return BookResponse.from_domain(returned_book)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/books/{book_id}")
def delete_book(req: BookDeleteRequest):
    book_usecase.delete(req.id)
    return {"message": "Book deleted"}

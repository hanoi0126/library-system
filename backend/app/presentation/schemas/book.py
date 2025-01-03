from pydantic import BaseModel

from app.domain.entities.book import Book


class BookCreateRequest(BaseModel):
    id: str
    title: str


class BookDeleteRequest(BaseModel):
    id: str


class BookResponse(BaseModel):
    id: str
    title: str
    is_borrowed: bool

    @classmethod
    def from_domain(cls, book: Book):
        return cls(
            id=book.id,
            title=book.title,
            is_borrowed=book.is_borrowed,
        )

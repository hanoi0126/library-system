from sqlalchemy.orm import Session

from app.domain.entities.book import Book
from app.domain.repositories.book import IBookRepository
from app.infrastructures.db.connection import SessionLocal
from app.infrastructures.db.models import BookModel


class BookRepository(IBookRepository):
    def __init__(self, session: Session | None = None):
        self.session = session

    def find_by_id(self, id: str) -> Book | None:
        if self.session is None:
            self.session = SessionLocal()
        book = self.session.query(BookModel).filter(BookModel.id == id).first()
        return self._to_domain(book) if book else None

    def find_all(self) -> list[Book]:
        if self.session is None:
            self.session = SessionLocal()
        books = self.session.query(BookModel).all()
        return [self._to_domain(b) for b in books]

    def save(self, book: Book) -> None:
        if self.session is None:
            self.session = SessionLocal()
        existing = self.session.query(BookModel).filter(BookModel.id == book.id).first()
        if existing:
            # UPDATE
            existing.title = book.title
            existing.is_borrowed = book.is_borrowed
        else:
            # INSERT (新規追加)
            new_record = BookModel(
                id=book.id,
                title=book.title,
                is_borrowed=book.is_borrowed,
            )
            self.session.add(new_record)
        self.session.commit()

    def delete(self, id: str) -> None:
        if self.session is None:
            self.session = SessionLocal()
        self.session.query(BookModel).filter(BookModel.id == id).delete()
        self.session.commit()

    def _to_domain(self, record: BookModel) -> Book:
        return Book(
            id=str(record.id),
            title=str(record.title),
            is_borrowed=bool(record.is_borrowed),
        )

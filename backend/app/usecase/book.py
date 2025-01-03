from app.domain.entities.book import Book
from app.domain.repositories.book import IBookRepository


class BookUseCase:
    def __init__(self, repository: IBookRepository):
        self.repository = repository

    def find_by_id(self, id: str) -> Book | None:
        return self.repository.find_by_id(id)

    def find_all(self) -> list[Book]:
        return self.repository.find_all()

    def save(self, book: Book) -> None:
        self.repository.save(book)

    def delete(self, id: str) -> None:
        self.repository.delete(id)

    def borrow_book(self, id: str) -> Book:
        book = self.repository.find_by_id(id)
        if not book:
            raise Exception("Book not found")
        book.borrow()
        self.repository.save(book)
        return book

    def return_book(self, id: str) -> Book:
        book = self.repository.find_by_id(id)
        if not book:
            raise Exception("Book not found")
        book.return_book()
        self.repository.save(book)
        return book
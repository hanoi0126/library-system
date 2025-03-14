from abc import ABC, abstractmethod

from app.domain.models.book import Book, Id


class IBookRepository(ABC):
    @abstractmethod
    def find_by_id(self, book_id: Id) -> Book | None:
        pass

    @abstractmethod
    def find_all(self) -> list[Book]:
        pass

    @abstractmethod
    def save(self, book: Book) -> None:
        pass

    @abstractmethod
    def delete(self, book_id: Id) -> None:
        pass

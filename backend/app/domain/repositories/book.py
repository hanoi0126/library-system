from abc import ABC, abstractmethod

from app.domain.entities.book import Book


class IBookRepository(ABC):
    @abstractmethod
    def find_by_id(self, id: str) -> Book | None:
        pass

    @abstractmethod
    def find_all(self) -> list[Book]:
        pass

    @abstractmethod
    def save(self, book: Book) -> None:
        pass

    @abstractmethod
    def delete(self, id: str) -> None:
        pass

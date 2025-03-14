from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, StrictStr

from app.domain.models.user import Id as UserId


class Id(BaseModel):
    value: StrictStr

    @classmethod
    def generate(cls) -> "Id":
        return cls(value=str(uuid4()))


class Title(BaseModel):
    value: StrictStr


class Author(BaseModel):
    value: StrictStr


class Description(BaseModel):
    value: StrictStr


class Category(Enum):
    DEEP_LEARNING = "Deep Learning"
    MACHINE_LEARNING = "Machine Learning"
    PYTHON = "Python"
    OTHER = "Other"


class BookStatus(Enum):
    AVAILABLE = "available"
    BORROWED = "borrowed"


class Book(BaseModel):
    id: Id
    title: Title
    author: Author
    description: Description | None = None
    category: list[Category]
    status: BookStatus = BookStatus.AVAILABLE
    borrowed_by: UserId | None = None

    @property
    def is_available(self) -> bool:
        return self.status == BookStatus.AVAILABLE

    def borrow(self, user_id: UserId) -> None:
        if not self.is_available:
            raise ValueError("Book is not available for borrowing")
        self.status = BookStatus.BORROWED
        self.borrowed_by = user_id

    def return_book(self) -> None:
        if self.status != BookStatus.BORROWED:
            raise ValueError("Book is not borrowed")
        self.status = BookStatus.AVAILABLE
        self.borrowed_by = None

from app.domain.models.book import (
    ISBN,
    Author,
    Book,
    BookStatus,
    Category,
    Description,
    Id as BookId,
    Title,
)
from app.domain.models.user import Id as UserId
from app.domain.services.book import IBookRepository


class BookUseCase:
    def __init__(self, book_repository: IBookRepository) -> None:
        self.book_repository = book_repository

    def get_book_by_id(self, book_id: str) -> Book | None:
        return self.book_repository.find_by_id(BookId(value=book_id))

    def get_all_books(self, page: int = 1, limit: int = 10, title: str | None = None) -> list[Book]:
        # In a real application, we would implement pagination and filtering here
        books = self.book_repository.find_all()

        # Apply title filter if provided
        if title:
            books = [book for book in books if title.lower() in book.title.value.lower()]

        # Apply pagination
        start = (page - 1) * limit
        end = start + limit
        return books[start:end]

    def create_book(
        self,
        title: str,
        author: str,
        isbn: str,
        description: str | None,
        category: str,
    ) -> Book:
        # Create a new book
        book = Book(
            id=BookId.generate(),
            title=Title(value=title),
            author=Author(value=author),
            isbn=ISBN(value=isbn),
            description=Description(value=description) if description else None,
            category=[self._parse_category(category)],
            status=BookStatus.AVAILABLE,
        )

        # Save the book
        self.book_repository.save(book)
        return book

    def update_book(
        self,
        book_id: str,
        title: str | None = None,
        author: str | None = None,
        isbn: str | None = None,
        description: str | None = None,
        category: str | None = None,
    ) -> Book | None:
        # Get the book
        book = self.book_repository.find_by_id(BookId(value=book_id))
        if not book:
            return None

        # Update the book
        if title:
            book.title = Title(value=title)
        if author:
            book.author = Author(value=author)
        if isbn:
            book.isbn = ISBN(value=isbn)
        if description is not None:  # Allow empty string to clear description
            book.description = Description(value=description) if description else None
        if category:
            book.category = [self._parse_category(category)]

        # Save the book
        self.book_repository.save(book)
        return book

    def delete_book(self, book_id: str) -> bool:
        # Get the book
        book = self.book_repository.find_by_id(BookId(value=book_id))
        if not book:
            return False

        # Delete the book
        self.book_repository.delete(BookId(value=book_id))
        return True

    def borrow_book(self, book_id: str, user_id: str) -> Book | None:
        # Get the book
        book = self.book_repository.find_by_id(BookId(value=book_id))
        if not book:
            return None

        # Check if the book is available
        if not book.is_available:
            return None

        # Borrow the book
        book.borrow(UserId(value=user_id))

        # Save the book
        self.book_repository.save(book)
        return book

    def return_book(self, book_id: str) -> Book | None:
        # Get the book
        book = self.book_repository.find_by_id(BookId(value=book_id))
        if not book:
            return None

        # Check if the book is borrowed
        if book.status != BookStatus.BORROWED:
            return None

        # Return the book
        book.return_book()

        # Save the book
        self.book_repository.save(book)
        return book

    def _parse_category(self, category: str) -> Category:
        try:
            return Category(category)
        except ValueError:
            return Category.OTHER

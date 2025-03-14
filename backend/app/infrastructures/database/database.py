from sqlalchemy.orm import Session

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
from app.domain.models.user import (
    Email,
    Id as UserId,
    Name,
    Password,
    User,
)
from app.domain.services.book import IBookRepository
from app.domain.services.user import IUserRepository

from .connection import SessionLocal
from .models import BookModel, UserModel


class BookRepository(IBookRepository):
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def find_by_id(self, book_id: BookId) -> Book | None:
        book = self.session.query(BookModel).filter(BookModel.id == book_id.value).first()
        return self._to_domain(book) if book else None

    def find_all(self) -> list[Book]:
        books = self.session.query(BookModel).all()
        return [self._to_domain(b) for b in books]

    def save(self, book: Book) -> None:
        existing = self.session.query(BookModel).filter(BookModel.id == book.id.value).first()
        if existing:
            existing.title = book.title.value
            existing.author = book.author.value
            existing.isbn = book.isbn.value
            existing.description = book.description.value if book.description else ""
            existing.category = book.category[0].value if book.category else Category.OTHER.value
            existing.status = book.status.value
            existing.borrowed_by_id = book.borrowed_by.value if book.borrowed_by else None
        else:
            new_record = BookModel(
                id=book.id.value,
                title=book.title.value,
                author=book.author.value,
                isbn=book.isbn.value,
                description=book.description.value if book.description else "",
                category=book.category[0].value if book.category else Category.OTHER.value,
                status=book.status.value,
                borrowed_by_id=book.borrowed_by.value if book.borrowed_by else None,
            )
            self.session.add(new_record)
        self.session.commit()

    def delete(self, book_id: BookId) -> None:
        self.session.query(BookModel).filter(BookModel.id == book_id.value).delete()
        self.session.commit()

    def _to_domain(self, record: BookModel) -> Book:
        borrowed_by = UserId(value=str(record.borrowed_by_id)) if record.borrowed_by_id else None
        return Book(
            id=BookId(value=record.id),
            title=Title(value=record.title),
            author=Author(value=record.author),
            isbn=ISBN(value=record.isbn),
            description=Description(value=record.description) if record.description else None,
            category=[Category(record.category)],
            status=BookStatus(record.status),
            borrowed_by=borrowed_by,
        )


class UserRepository(IUserRepository):
    def __init__(self, session: Session | None = None) -> None:
        self.session = session or SessionLocal()

    def find_by_id(self, user_id: UserId) -> User | None:
        user = self.session.query(UserModel).filter(UserModel.id == user_id.value).first()
        return self._to_domain(user) if user else None

    def find_by_email(self, email: Email) -> User | None:
        user = self.session.query(UserModel).filter(UserModel.email == email.value).first()
        return self._to_domain(user) if user else None

    def find_all(self) -> list[User]:
        users = self.session.query(UserModel).all()
        return [self._to_domain(u) for u in users]

    def save(self, user: User) -> None:
        existing = self.session.query(UserModel).filter(UserModel.id == user.id.value).first()
        if existing:
            existing.name = user.name.value
            existing.email = user.email.value
            existing.password = user.password.value
            existing.is_admin = user.is_admin
        else:
            new_record = UserModel(
                id=user.id.value,
                name=user.name.value,
                email=user.email.value,
                password=user.password.value,
                is_admin=user.is_admin,
            )
            self.session.add(new_record)
        self.session.commit()

    def delete(self, user_id: UserId) -> None:
        self.session.query(UserModel).filter(UserModel.id == user_id.value).delete()
        self.session.commit()

    def _to_domain(self, record: UserModel) -> User:
        return User(
            id=UserId(value=record.id),
            name=Name(value=record.name),
            email=Email(value=record.email),
            password=Password(value=record.password),
            is_admin=record.is_admin,
        )

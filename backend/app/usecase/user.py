from app.domain.models.book import Id as BookId
from app.domain.models.user import (
    Email,
    Id as UserId,
    Name,
    Password,
    User,
)
from app.domain.services.book import IBookRepository
from app.domain.services.user import IUserRepository


class UserUseCase:
    def __init__(self, user_repository: IUserRepository, book_repository: IBookRepository) -> None:
        self.user_repository = user_repository
        self.book_repository = book_repository

    def get_user_by_id(self, user_id: str) -> User | None:
        return self.user_repository.find_by_id(UserId(value=user_id))

    def get_user_by_email(self, email: str) -> User | None:
        return self.user_repository.find_by_email(Email(value=email))

    def get_all_users(self) -> list[User]:
        return self.user_repository.find_all()

    def create_user(self, name: str, email: str, password: str, is_admin: bool = False) -> User:
        # Check if user with email already exists
        existing_user = self.user_repository.find_by_email(Email(value=email))
        if existing_user:
            raise ValueError(f"User with email {email} already exists")

        # Create a new user
        user = User(
            id=UserId.generate(),
            name=Name(value=name),
            email=Email(value=email),
            password=Password(value=password),  # In a real app, we would hash the password
            is_admin=is_admin,
        )

        # Save the user
        self.user_repository.save(user)
        return user

    def update_user(
        self, user_id: str, name: str | None = None, password: str | None = None, is_admin: bool | None = None
    ) -> User | None:
        # Get the user
        user = self.user_repository.find_by_id(UserId(value=user_id))
        if not user:
            return None

        # Update the user
        if name:
            user.name = Name(value=name)
        if password:
            user.password = Password(value=password)  # In a real app, we would hash the password
        if is_admin is not None:
            user.is_admin = is_admin

        # Save the user
        self.user_repository.save(user)
        return user

    def delete_user(self, user_id: str) -> bool:
        # Get the user
        user = self.user_repository.find_by_id(UserId(value=user_id))
        if not user:
            return False

        # Delete the user
        self.user_repository.delete(UserId(value=user_id))
        return True

    def authenticate_user(self, email: str, password: str) -> User | None:
        # Get the user
        user = self.user_repository.find_by_email(Email(value=email))
        if not user:
            return None

        # Check the password (in a real app, we would verify the hash)
        if user.password.value != password:
            return None

        return user

    def get_user_books(self, user_id: str) -> list[BookId]:
        # Get all books
        books = self.book_repository.find_all()

        # Filter books borrowed by the user
        user_books = [book.id for book in books if book.borrowed_by and book.borrowed_by.value == user_id]

        return user_books

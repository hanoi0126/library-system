from abc import ABC, abstractmethod

from app.domain.models.user import Email, Id, User


class IUserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: Id) -> User | None:
        pass

    @abstractmethod
    def find_by_email(self, email: Email) -> User | None:
        pass

    @abstractmethod
    def find_all(self) -> list[User]:
        pass

    @abstractmethod
    def save(self, user: User) -> None:
        pass

    @abstractmethod
    def delete(self, user_id: Id) -> None:
        pass

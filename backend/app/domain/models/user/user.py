from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, EmailStr, StrictBool, StrictStr


class Id(BaseModel):
    value: StrictStr

    @classmethod
    def generate(cls) -> "Id":
        return cls(value=str(uuid4()))


class Name(BaseModel):
    value: StrictStr


class Email(BaseModel):
    value: EmailStr


class Password(BaseModel):
    value: StrictStr


class UserRole(Enum):
    USER = "user"
    ADMIN = "admin"


class User(BaseModel):
    id: Id
    name: Name
    email: Email
    password: Password
    is_admin: StrictBool = False

    @property
    def role(self) -> UserRole:
        return UserRole.ADMIN if self.is_admin else UserRole.USER

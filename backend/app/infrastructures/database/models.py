#!/usr/bin/env python
from sqlalchemy import Boolean, Column, ForeignKey, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String, unique=True)
    password: Mapped[str] = mapped_column(String)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationship with BookModel for borrowed books
    borrowed_books = relationship("BookModel", back_populates="borrowed_by")


class BookModel(Base):
    __tablename__ = "books"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    author: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="available")  # available, borrowed

    # Relationship with UserModel
    borrowed_by_id = Column(String, ForeignKey("users.id"), nullable=True)
    borrowed_by = relationship("UserModel", back_populates="borrowed_books")

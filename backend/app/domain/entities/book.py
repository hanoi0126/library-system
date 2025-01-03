from pydantic import BaseModel


class Book(BaseModel):
    id: str
    title: str
    is_borrowed: bool

    def borrow(self):
        if self.is_borrowed:
            raise Exception("Book is already borrowed")
        self.is_borrowed = True

    def return_book(self):
        if not self.is_borrowed:
            raise Exception("Book is not borrowed")
        self.is_borrowed = False

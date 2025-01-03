from pydantic import BaseModel


class Book(BaseModel):
    id: str
    title: str
    is_borrowed: bool

    def checkout(self):
        if self.is_borrowed:
            raise Exception(f"Book is already borrowed (id={self.id})")
        self.is_borrowed = True

    def checkin(self):
        if not self.is_borrowed:
            raise Exception(f"Book is not borrowed (id={self.id})")
        self.is_borrowed = False

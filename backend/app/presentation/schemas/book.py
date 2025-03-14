from pydantic import BaseModel, Field


class BookBase(BaseModel):
    title: str
    author: str
    description: str | None = None
    category: str


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: str | None = None
    author: str | None = None
    description: str | None = None
    category: str | None = None


class BookResponse(BookBase):
    id: str
    status: str
    borrowed_by_id: str | None = None

    class Config:
        from_attributes = True


class BookListResponse(BaseModel):
    items: list[BookResponse]
    total: int
    page: int
    limit: int


class BookBorrowRequest(BaseModel):
    user_id: str = Field(..., description="ID of the user borrowing the book")


class BookReturnRequest(BaseModel):
    user_id: str = Field(..., description="ID of the user returning the book")

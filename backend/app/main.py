# app/main.py
import uvicorn
from fastapi import FastAPI

from app.infrastructures.db.connection import engine
from app.infrastructures.db.models import Base
from app.presentation.controllers.book_controller import router as book_router


def create_app() -> FastAPI:
    app = FastAPI()
    Base.metadata.create_all(bind=engine)  # DBテーブル作成 (SQLiteなど)
    app.include_router(book_router)
    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

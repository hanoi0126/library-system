# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.infrastructures.database.connection import engine
from app.infrastructures.database.models import Base
from app.presentation.controllers.book_controller import router as book_router
from app.presentation.controllers.user_controller import router as user_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Library Management System API",
        description="API for managing books and users in a library system",
        version="1.0.0",
    )

    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods
        allow_headers=["*"],  # Allow all headers
    )

    # Create database tables
    Base.metadata.create_all(bind=engine)

    # Include routers
    app.include_router(book_router)
    app.include_router(user_router)

    return app


app = create_app()

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

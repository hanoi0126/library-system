# Library Management System

A full-stack application for managing a library's book collection, with features for borrowing, returning, and searching books.

## Project Structure

- **Backend**: FastAPI application with domain-driven design
- **Frontend**: React application with Material UI

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

## Setup

### Backend Setup

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
# or using uv
uv pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

You can start both the backend and frontend with a single command using the provided Makefile:

```bash
# Start both backend and frontend
make up

# To stop all services
make down

# To run only the backend
make backend

# To run only the frontend
make frontend
```

### Manual Startup

If you prefer to start the services manually:

**Backend**:
```bash
cd backend
uvicorn app.app:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
cd frontend
npm run dev
```

## Accessing the Application

- Backend API: http://localhost:8000/api
- Frontend: http://localhost:5173 (or the port shown in your terminal)

## API Endpoints

### Books

- `GET /api/books` - List all books
- `GET /api/books/{book_id}` - Get a specific book
- `POST /api/books` - Create a new book (admin only)
- `PUT /api/books/{book_id}` - Update a book (admin only)
- `DELETE /api/books/{book_id}` - Delete a book (admin only)
- `POST /api/books/{book_id}/borrow` - Borrow a book
- `POST /api/books/{book_id}/return` - Return a book

### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get access token
- `GET /api/users/{user_id}` - Get user details
- `PUT /api/users/{user_id}` - Update user details
- `DELETE /api/users/{user_id}` - Delete a user (admin only)
- `GET /api/users/{user_id}/books` - Get books borrowed by a user

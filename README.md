# Library Management System

A full-stack application for managing a library's book collection, with features for borrowing, returning, and searching books.

## Features

- User authentication and authorization (admin and regular users)
- Book management (add, edit, delete books)
- Book borrowing and returning functionality
- Search and filter books by various criteria
- User profile management
- Admin dashboard for system oversight
- Responsive UI for desktop and mobile devices

## Technology Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation and settings management
- **JWT**: Authentication using JSON Web Tokens
- **Domain-Driven Design**: Architecture pattern for complex business logic

### Frontend
- **React**: JavaScript library for building user interfaces
- **Vite**: Next generation frontend tooling
- **React Router**: Declarative routing for React
- **Context API**: State management
- **Material UI**: Component library for modern UI design

## Project Architecture

The project follows a clean architecture approach with domain-driven design principles:

### Backend Structure
- **Domain Layer**: Core business logic and entities
  - Models: Book and User entities
  - Services: Domain-specific business rules
- **Use Case Layer**: Application-specific business rules
  - Orchestrates the flow of data between domain and infrastructure
- **Infrastructure Layer**: External interfaces like databases
  - Database connections and ORM models
- **Presentation Layer**: API controllers and schemas
  - REST endpoints and request/response schemas

### Frontend Structure
- **Components**: Reusable UI elements
- **Pages**: Screen-level components
- **Context**: Application state management
- **Services**: API communication

## Project Structure

```
library-system/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── domain/           # Domain models and services
│   │   ├── usecase/          # Application use cases
│   │   ├── infrastructures/  # Database and external services
│   │   └── presentation/     # API controllers and schemas
│   ├── tests/                # Backend tests
│   └── makefile              # Backend-specific commands
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   └── index.html            # HTML entry point
└── Makefile                  # Project-level commands
```

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
- API Documentation: http://localhost:8000/docs (Swagger UI)

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

## Development

### Backend Development

The backend follows domain-driven design principles:

1. **Domain Layer**: Contains the core business logic and entities
2. **Use Case Layer**: Implements application-specific business rules
3. **Infrastructure Layer**: Handles external concerns like database access
4. **Presentation Layer**: Manages API endpoints and request/response formatting

### Frontend Development

The frontend uses React with the following organization:

1. **Components**: Reusable UI elements
2. **Pages**: Screen-level components that use multiple components
3. **Context**: Application state management using React Context API
4. **Services**: API communication and data fetching

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Library Management System - React Frontend

A modern React-based frontend for the Library Management System, built with Material UI for an enhanced user experience.

## Features

- Modern, responsive UI built with Material UI components
- Add, borrow, return, and delete books
- Search functionality for finding books by title
- Real-time status updates for book availability
- Improved user feedback with snackbar notifications and confirmation dialogs

## Technologies Used

- React 19
- Material UI 6
- Vite (for fast development and optimized builds)
- Emotion (for styling)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

To create a production build:

```
npm run build
```

The build files will be generated in the `dist` directory.

## Project Structure

- `src/` - Source code
  - `components/` - React components
    - `BookForm.jsx` - Component for adding new books
    - `BookList.jsx` - Component for displaying and managing books
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## API Integration

The frontend communicates with the backend API at `http://localhost:8000` for all book management operations:

- GET `/books` - Fetch all books
- POST `/books` - Add a new book
- DELETE `/books/{id}` - Delete a book
- POST `/books/{id}/borrow` - Borrow a book
- POST `/books/{id}/return` - Return a book

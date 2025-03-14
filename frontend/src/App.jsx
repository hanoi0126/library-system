import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import BookForm from './components/BookForm';
import BookList from './components/BookList';

// API Base URL
const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new book
  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add book');
      }
      
      fetchBooks();
      return { success: true };
    } catch (error) {
      console.error('Error adding book:', error);
      return { success: false, message: error.message };
    }
  };

  // Borrow a book
  const handleBorrowBook = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/borrow`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to borrow book');
      }
      
      fetchBooks();
      return { success: true };
    } catch (error) {
      console.error('Error borrowing book:', error);
      return { success: false, message: error.message };
    }
  };

  // Return a book
  const handleReturnBook = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/return`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to return book');
      }
      
      fetchBooks();
      return { success: true };
    } catch (error) {
      console.error('Error returning book:', error);
      return { success: false, message: error.message };
    }
  };

  // Delete a book
  const handleDeleteBook = async (bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete book');
      }
      
      fetchBooks();
      return { success: true };
    } catch (error) {
      console.error('Error deleting book:', error);
      return { success: false, message: error.message };
    }
  };

  // Search books by title
  const handleSearchBooks = (searchTerm) => {
    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      setFilteredBooks(
        books.filter(book => book.title.toLowerCase().includes(lowercaseSearchTerm))
      );
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <BookForm onAddBook={handleAddBook} />
        </Box>
        
        <Box>
          <BookList 
            books={filteredBooks}
            loading={loading}
            error={error}
            onBorrowBook={handleBorrowBook}
            onReturnBook={handleReturnBook}
            onDeleteBook={handleDeleteBook}
            onSearchBooks={handleSearchBooks}
          />
        </Box>
        
        <Box component="footer" sx={{ mt: 4, py: 3, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Library Management System
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, IconButton, Tooltip } from '@mui/material';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

function HomePage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      setBooks(data.items);
      setFilteredBooks(data.items);
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookData),
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
      const userId = user.id;
      
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId }),
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
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
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
  const handleSearchBooks = async (searchTerm) => {
    try {
      setLoading(true);
      
      // If empty search term, fetch all books
      if (!searchTerm) {
        fetchBooks();
        return;
      }
      
      // Otherwise, use the API's title filter
      const response = await fetch(
        `${API_BASE_URL}/books?title=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search books');
      }

      const data = await response.json();
      setFilteredBooks(data.items);
      setError(null);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Failed to search books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, [token]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.is_admin ? 'Admin: ' : 'User: '}{user.name}
              </Typography>
              {user.is_admin && (
                <Tooltip title="Admin Settings">
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/admin')}
                    sx={{ mr: 1 }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        {user?.is_admin && (
          <Box sx={{ mb: 4 }}>
            <BookForm onAddBook={handleAddBook} />
          </Box>
        )}
        
        <Box>
          <BookList 
            books={filteredBooks}
            loading={loading}
            error={error}
            onBorrowBook={handleBorrowBook}
            onReturnBook={handleReturnBook}
            onDeleteBook={handleDeleteBook}
            onSearchBooks={handleSearchBooks}
            isAdmin={user?.is_admin}
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

export default HomePage;

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  BookmarkRemove as ReturnIcon
} from '@mui/icons-material';

function BookList({
  books,
  loading,
  error,
  onBorrowBook,
  onReturnBook,
  onDeleteBook,
  onSearchBooks
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSearch = () => {
    onSearchBooks(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    onSearchBooks('');
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBorrow = async (bookId) => {
    const result = await onBorrowBook(bookId);
    if (!result.success) {
      setSnackbar({
        open: true,
        message: result.message || 'Failed to borrow book',
        severity: 'error'
      });
    }
  };

  const handleReturn = async (bookId) => {
    const result = await onReturnBook(bookId);
    if (!result.success) {
      setSnackbar({
        open: true,
        message: result.message || 'Failed to return book',
        severity: 'error'
      });
    }
  };

  const openDeleteDialog = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      const result = await onDeleteBook(bookToDelete.id);
      closeDeleteDialog();
      
      if (!result.success) {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to delete book',
          severity: 'error'
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Book Collection
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Search by title"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleReset} edge="end">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ flexGrow: 1 }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<ClearIcon />}
                sx={{ flexGrow: 1 }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : books.length === 0 ? (
        <Alert severity="info">No books found.</Alert>
      ) : (
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    ID: {book.id}
                  </Typography>
                  <Chip
                    label={book.is_borrowed ? 'Borrowed' : 'Available'}
                    color={book.is_borrowed ? 'error' : 'success'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
                <CardActions>
                  {book.is_borrowed ? (
                    <Button
                      size="small"
                      startIcon={<ReturnIcon />}
                      onClick={() => handleReturn(book.id)}
                      color="warning"
                    >
                      Return
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      startIcon={<BookIcon />}
                      onClick={() => handleBorrow(book.id)}
                      color="success"
                    >
                      Borrow
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => openDeleteDialog(book)}
                    color="error"
                    sx={{ ml: 'auto' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the book "{bookToDelete?.title}" (ID: {bookToDelete?.id})?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default BookList;

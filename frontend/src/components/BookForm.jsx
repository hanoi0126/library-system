import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !author.trim() || !category.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    const result = await onAddBook({
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || null,
      category: category.trim()
    });
    
    if (result.success) {
      setTitle('');
      setAuthor('');
      setDescription('');
      setCategory('');
      setSnackbar({
        open: true,
        message: 'Book added successfully!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: result.message || 'Failed to add book',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Add New Book
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Author"
              variant="outlined"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Book
          </Button>
        </Box>
      </Box>
      
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

export default BookForm;

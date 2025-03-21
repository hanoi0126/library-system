import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  Tabs, 
  Tab, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import BookForm from '../components/BookForm';

// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminPage() {
  const { user, token, logout, register } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserDialog, setEditUserDialog] = useState(false);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserIsAdmin, setEditUserIsAdmin] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  // Fetch all books
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
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users with token:', token);
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', response.status, errorData);
        throw new Error(`Failed to fetch users: ${response.status} ${errorData.detail || ''}`);
      }

      const data = await response.json();
      console.log('Users data:', data);
      setUsers(data.items);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to load users: ${error.message}`);
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
      setSnackbar({
        open: true,
        message: 'Book added successfully',
        severity: 'success'
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding book:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add book',
        severity: 'error'
      });
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
      setSnackbar({
        open: true,
        message: 'Book deleted successfully',
        severity: 'success'
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting book:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete book',
        severity: 'error'
      });
      return { success: false, message: error.message };
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      // Don't allow deleting yourself
      if (userId === user.id) {
        throw new Error("You cannot delete your own account");
      }
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete user');
      }

      fetchUsers();
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to delete user',
        severity: 'error'
      });
    }
  };

  // Open edit user dialog
  const handleEditUserOpen = (user) => {
    setCurrentUser(user);
    setEditUserName(user.name);
    setEditUserIsAdmin(user.is_admin);
    setEditUserDialog(true);
  };

  // Close edit user dialog
  const handleEditUserClose = () => {
    setEditUserDialog(false);
    setCurrentUser(null);
  };

  // Open add user dialog
  const handleAddUserOpen = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserIsAdmin(false);
    setAddUserDialog(true);
  };

  // Close add user dialog
  const handleAddUserClose = () => {
    setAddUserDialog(false);
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      const userData = {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        is_admin: newUserIsAdmin
      };
      
      const result = await register(userData);
      
      if (result.success) {
        fetchUsers();
        setSnackbar({
          open: true,
          message: 'User added successfully',
          severity: 'success'
        });
        handleAddUserClose();
      } else {
        throw new Error(result.message || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add user',
        severity: 'error'
      });
    }
  };

  // Save user changes
  const handleSaveUser = async () => {
    try {
      if (!currentUser) return;
      
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editUserName,
          is_admin: editUserIsAdmin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user');
      }

      fetchUsers();
      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      handleEditUserClose();
    } catch (error) {
      console.error('Error updating user:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update user',
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Load data on component mount
  useEffect(() => {
    if (tabValue === 0) {
      fetchBooks();
    } else {
      fetchUsers();
    }
  }, [tabValue, token]);

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleBackToHome}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Admin: {user.name}
              </Typography>
              <Button 
                color="inherit" 
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant={tabValue === 0 ? "contained" : "outlined"} 
              onClick={() => setTabValue(0)}
              sx={{ mr: 2 }}
            >
              Book Management
            </Button>
            <Button 
              variant={tabValue === 1 ? "contained" : "outlined"} 
              onClick={() => setTabValue(1)}
            >
              User Management
            </Button>
          </Box>
          
          {/* Book Management Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Add New Book
              </Typography>
              <BookForm onAddBook={handleAddBook} />
            </Box>
            
            <Typography variant="h5" gutterBottom>
              Book List
            </Typography>
            {loading ? (
              <Typography>Loading books...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          {book.borrowed_by ? 'Borrowed' : 'Available'}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteBook(book.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {books.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No books found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          
          {/* User Management Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                User List
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddUserOpen}
              >
                Add User
              </Button>
            </Box>
            {loading ? (
              <Typography>Loading users...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.is_admin ? 'Admin' : 'User'}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEditUserOpen(user)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Paper>
        
        {/* Edit User Dialog */}
        <Dialog open={editUserDialog} onClose={handleEditUserClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update user information
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editUserName}
              onChange={(e) => setEditUserName(e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editUserIsAdmin}
                  onChange={(e) => setEditUserIsAdmin(e.target.checked)}
                  color="primary"
                />
              }
              label="Admin User"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditUserClose}>Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Add User Dialog */}
        <Dialog open={addUserDialog} onClose={handleAddUserClose}>
          <DialogTitle>Add New User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the details for the new user
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={newUserIsAdmin}
                  onChange={(e) => setNewUserIsAdmin(e.target.checked)}
                  color="primary"
                />
              }
              label="Admin User"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddUserClose}>Cancel</Button>
            <Button 
              onClick={handleAddUser} 
              variant="contained" 
              color="primary"
              disabled={!newUserName || !newUserEmail || !newUserPassword}
            >
              Add User
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
      </Container>
    </>
  );
}

export default AdminPage;

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Snackbar,
  Alert,
  Link,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function LoginForm({ onLogin, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      if (!email.trim() || !password.trim()) {
        setSnackbar({
          open: true,
          message: 'Please fill in all fields',
          severity: 'error'
        });
        return;
      }
      
      const result = await onLogin({
        email: email.trim(),
        password: password.trim()
      });
      
      if (!result.success) {
        setSnackbar({
          open: true,
          message: result.message || 'Login failed',
          severity: 'error'
        });
      }
    } else {
      // Register
      if (!name.trim() || !email.trim() || !password.trim()) {
        setSnackbar({
          open: true,
          message: 'Please fill in all fields',
          severity: 'error'
        });
        return;
      }
      
      const result = await onRegisterClick({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        is_admin: isAdmin
      });
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Registration successful! Please log in.',
          severity: 'success'
        });
        setIsLogin(true);
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Registration failed',
          severity: 'error'
        });
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setIsAdmin(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        {isLogin ? 'Login' : 'Register'}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {!isLogin && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          {!isLogin && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    color="primary"
                  />
                }
                label="Register as Admin"
              />
            </Grid>
          )}
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
            startIcon={isLogin ? <LoginIcon /> : <PersonAddIcon />}
            sx={{ mb: 2 }}
          >
            {isLogin ? 'Login' : 'Register'}
          </Button>
          
          <Link 
            component="button" 
            variant="body2" 
            onClick={toggleMode}
            underline="hover"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </Link>
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

export default LoginForm;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';

const LoginPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await usersService.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <AuthLayout title="Mi vaquita" subtitle="Inicia sesión para armar tus paseos">
      <Box component="form" onSubmit={handleLogin} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 1, py: 1.2 }}
        >
          Ingresar
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Button onClick={handleRegister} color="primary">
              {"Registrarme"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;

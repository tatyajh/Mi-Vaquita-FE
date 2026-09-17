import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';

const RegisterPage = () => {
  let navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await usersService.register(name, email, password);
      navigate('/login');
    } catch (error) {
      setError('Error al registrarse');
    }
  };

  return (
    <AuthLayout title="Registrarse" subtitle="Crea tu cuenta para empezar a repartir gastos">
      <Box component="form" onSubmit={handleRegister} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nombre"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo"
          name="email"
          autoComplete="email"
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
          Registrarse
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Button onClick={() => navigate('/login')} color="primary">
              {"¿Ya tienes cuenta? Iniciar sesión"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;

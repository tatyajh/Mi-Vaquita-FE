import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Link, TextField, Grid } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';
import PasswordField from '../components/common/PasswordField';

const LoginPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { token, user } = await usersService.login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;
      if (status === 401) {
        setError(serverMessage || 'Correo o contraseña incorrectos');
      } else if (!err?.response) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.');
      } else {
        setError(serverMessage || 'No se pudo iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <AuthLayout title="Mi vaquita" subtitle="Inicia sesión para armar tus paseos">
      <Box component="form" onSubmit={handleLogin} noValidate>
        <PasswordField
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
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Box sx={{ textAlign: 'right', mt: -1 }}>
          <Button component={RouterLink} to="/forgot-password" size="small" color="primary" sx={{ textTransform: 'none' }}>
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }} data-testid="login-error">
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={submitting}
          sx={{ mt: 3, mb: 1, py: 1.2 }}
        >
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
        <Grid container justifyContent="center">
          <Grid item>
            <Button onClick={handleRegister} color="primary">
              {"Registrarme"}
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link component={RouterLink} to="/terminos" variant="caption" color="text.secondary" sx={{ mr: 1.5 }}>
            Términos
          </Link>
          <Link component={RouterLink} to="/privacidad" variant="caption" color="text.secondary">
            Privacidad
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await usersService.forgotPassword(email);
      // El backend siempre responde igual exista o no el correo, así
      // que acá simplemente mostramos el mensaje de éxito.
      setSent(true);
    } catch (err) {
      setError('No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Recuperar contraseña" subtitle="Te enviaremos un enlace para elegir una nueva">
      {sent ? (
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Si ese correo está registrado, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).
          </Alert>
          <Button component={Link} to="/login" variant="contained" color="primary" fullWidth>
            Volver a iniciar sesión
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
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
            {submitting ? 'Enviando...' : 'Enviar enlace'}
          </Button>
          <Typography sx={{ textAlign: 'center', mt: 1 }}>
            <Button component={Link} to="/login" color="primary">
              Volver a iniciar sesión
            </Button>
          </Typography>
        </Box>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;

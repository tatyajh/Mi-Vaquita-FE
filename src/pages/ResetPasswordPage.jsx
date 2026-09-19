import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, TextField } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';

// Misma regla que el backend (al menos una minúscula y un número).
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[0-9])/;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!token) {
      return 'El enlace no es válido. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".';
    }
    if (!PASSWORD_PATTERN.test(password)) {
      return 'La contraseña debe tener al menos una letra minúscula y un número';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }
    setSubmitting(true);
    try {
      await usersService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      setError(serverMessage || 'No se pudo restablecer la contraseña. El enlace puede haber vencido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Elige una nueva contraseña" subtitle="Ingresa tu nueva contraseña para tu cuenta">
      {success ? (
        <Alert severity="success">Contraseña actualizada. Te llevamos al login...</Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {!token && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Este enlace no tiene un token válido. Pídelo de nuevo desde{' '}
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>.
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nueva contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            helperText="Debe incluir al menos una letra minúscula y un número"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar nueva contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {submitting ? 'Guardando...' : 'Guardar nueva contraseña'}
          </Button>
        </Box>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;

import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Checkbox, FormControlLabel, Link, TextField, Grid } from '@mui/material';
import AuthLayout from '../components/auth/AuthLayout';
import usersService from '../services/UsersService';
import PasswordField from '../components/common/PasswordField';

// Mirrors the backend Joi rule in Mi-Vaquita-BE/src/validations/users.validations.js:
// password must contain at least one lowercase letter and one digit.
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[0-9])/;

const RegisterPage = () => {
  let navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (name.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!password) {
      return 'La contraseña es obligatoria';
    }
    if (!PASSWORD_PATTERN.test(password)) {
      return 'La contraseña debe tener al menos una letra minúscula y un número';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    if (!acceptedTerms) {
      return 'Debes aceptar los términos de servicio y la política de privacidad';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }

    setSubmitting(true);
    try {
      await usersService.register(name, email, password);
      navigate('/login');
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;

      if (status === 409) {
        setError(serverMessage || 'Este correo ya está registrado. Intenta iniciar sesión.');
      } else if (status === 400) {
        setError(serverMessage || 'Revisa los datos ingresados: el correo o la contraseña no son válidos.');
      } else if (!err?.response) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.');
      } else {
        setError(serverMessage || 'No se pudo completar el registro. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Registrarse" subtitle="Crea tu cuenta para empezar a repartir gastos">
      <Box component="form" onSubmit={handleRegister} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} data-testid="register-error">
            {error}
          </Alert>
        )}
        <PasswordField
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
          type="email"
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
          id="password"
          autoComplete="new-password"
          helperText="Debe incluir al menos una letra minúscula y un número"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar contraseña"
          id="confirmPassword"
          autoComplete="new-password"
          error={Boolean(confirmPassword) && confirmPassword !== password}
          helperText={
            Boolean(confirmPassword) && confirmPassword !== password
              ? 'Las contraseñas no coinciden'
              : ''
          }
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <FormControlLabel
          sx={{ mt: 1, alignItems: 'flex-start' }}
          control={
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              sx={{ pt: 0 }}
            />
          }
          label={
            <span>
              Acepto los{' '}
              <Link component={RouterLink} to="/terminos" target="_blank" rel="noopener">
                términos de servicio
              </Link>{' '}
              y la{' '}
              <Link component={RouterLink} to="/privacidad" target="_blank" rel="noopener">
                política de privacidad
              </Link>
            </span>
          }
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={submitting || !acceptedTerms}
          sx={{ mt: 2, mb: 1, py: 1.2 }}
        >
          {submitting ? 'Registrando...' : 'Registrarse'}
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

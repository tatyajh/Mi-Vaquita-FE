import React from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Logo from '../assets/layer-MC1.svg';
import { MILK_BAG_RADIUS } from '../utils/shape';

const DIFFERENTIATORS = [
  {
    icon: <ReceiptLongIcon fontSize="large" color="primary" />,
    title: 'Gastos de paseos',
    description: 'Reparte los gastos de cualquier plan automáticamente y mira quién le debe a quién con un clic.',
  },
  {
    icon: <SavingsIcon fontSize="large" color="primary" />,
    title: 'Natilleras',
    description: 'Aportes, cuotas, préstamos y cierre de tu natillera, sin excel improvisado ni cuaderno perdido.',
  },
  {
    icon: <CardGiftcardIcon fontSize="large" color="primary" />,
    title: 'Amigo secreto y rifas',
    description: 'Sorteo automático y notificación privada por correo para tu grupo. Nada de papelitos.',
  },
];

// Página pública de entrada ("/"). Un usuario ya logueado no debería
// ver el pitch de venta cada vez que abre la app, así que lo mandamos
// directo a /home — el mismo criterio que ya usa PrivateRoutes en App.js.
const LandingPage = () => {
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f1f7df' }}>
      <Container maxWidth="md" sx={{ py: { xs: 6, sm: 10 } }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Box sx={{ width: 96, height: 96, borderRadius: '32px 32px 48px 32px', background: '#dff1d2', display: 'grid', placeItems: 'center' }}>
            <img src={Logo} alt="Mi Vaquita" width={72} height={72} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '2rem', sm: '2.75rem' } }}>
            Mi Vaquita
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, maxWidth: 560 }}>
            La app para todo lo que organizas con tu parche.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
            Divide gastos de paseos, organiza natilleras y arma amigos secretos o rifas, todo en un
            solo lugar. Sin cuadernos, sin WhatsApp perdido, sin peleas por quién le debe a quién.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ px: 4, py: 1.2 }}>
              Crear cuenta gratis
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined" size="large" sx={{ px: 4, py: 1.2 }}>
              Iniciar sesión
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3} sx={{ mt: { xs: 4, sm: 6 } }}>
          {DIFFERENTIATORS.map((item) => (
            <Grid item xs={12} sm={4} key={item.title}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: MILK_BAG_RADIUS, textAlign: 'center' }} elevation={2}>
                {item.icon}
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 1.5 }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: { xs: 5, sm: 7 } }}>
          <Link component={RouterLink} to="/terminos" variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            Términos
          </Link>
          <Link component={RouterLink} to="/privacidad" variant="caption" color="text.secondary">
            Privacidad
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;

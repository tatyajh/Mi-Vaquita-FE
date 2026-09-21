import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, Chip, Container, Grid, List, ListItem,
  ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MILK_BAG_RADIUS } from '../utils/shape';
import billingService from '../services/BillingService';

const FREE_FEATURES = [
  'Grupos, gastos y saldos ilimitados',
  'Natilleras y actividades (amigo secreto, rifas)',
  'Amigos y reparto automático de gastos',
  'Recordatorios automáticos por correo (cuotas, cuentas y préstamos)',
];

const PRO_FEATURES = [
  'Exportar el historial de cada grupo a Excel/CSV',
  'Colores de grupo 100% personalizados',
];

const PricingPage = () => {
  const [searchParams] = useSearchParams();
  // Wompi (a diferencia de Stripe) no manda "success"/"cancel": solo
  // redirige de vuelta con ?id=<transacción> pase lo que pase. El
  // resultado real (aprobado/rechazado) llega por el webhook, así que
  // acá solo avisamos que estamos verificando y refrescamos el estado.
  const isReturningFromCheckout = searchParams.get('checkout') === 'return';
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    billingService.getBillingStatus()
      .then(setStatus)
      .catch(() => setStatus({ isPro: false }))
      .finally(() => setLoadingStatus(false));
  }, [isReturningFromCheckout]);

  const handleUpgrade = async () => {
    setError('');
    setUpgrading(true);
    try {
      const { url } = await billingService.createCheckoutSession();
      window.location.href = url;
    } catch (err) {
      if (err?.response?.status === 501) {
        setError('Los pagos todavía no están configurados en el servidor. Vuelve pronto.');
      } else {
        setError('No se pudo iniciar el pago. Intenta de nuevo.');
      }
      setUpgrading(false);
    }
  };

  const isPro = status?.isPro;

  return (
    <Box sx={{ minHeight: '100vh', background: '#f1f7df', py: { xs: 4, sm: 6 } }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          Planes de Mi Vaquita
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Lo esencial siempre es gratis. Pro suma un poco más de comodidad.
        </Typography>

        {isReturningFromCheckout && !isPro && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Estamos confirmando tu pago con Wompi. Si acabas de pagar, puede tardar unos segundos en reflejarse aquí — recarga la página en un momento.
          </Alert>
        )}
        {isReturningFromCheckout && isPro && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Listo! Tu plan Pro ya está activo.
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', borderRadius: MILK_BAG_RADIUS }} elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Gratis</Typography>
                <Typography variant="h4" sx={{ my: 1 }}>$0</Typography>
                <List dense>
                  {FREE_FEATURES.map(feature => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', borderRadius: MILK_BAG_RADIUS, border: '2px solid', borderColor: 'primary.main' }} elevation={4}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Pro</Typography>
                  {isPro && <Chip label="Tu plan actual" color="success" size="small" />}
                </Box>
                <Typography variant="h4" sx={{ my: 1 }}>$4.900<Typography component="span" variant="body2">/mes</Typography></Typography>
                <List dense>
                  {PRO_FEATURES.map(feature => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={loadingStatus || upgrading || isPro}
                  onClick={handleUpgrade}
                  sx={{ mt: 2, py: 1.2 }}
                >
                  {isPro ? 'Ya eres Pro' : upgrading ? 'Redirigiendo...' : 'Actualizar a Pro'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingPage;

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, Chip, Container, Grid, List, ListItem,
  ListItemIcon, ListItemText, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import billingService from '../services/BillingService';

const FREE_FEATURES = [
  'Grupos, gastos y saldos ilimitados',
  'Natilleras y actividades (amigo secreto, rifas)',
  'Amigos y reparto automático de gastos',
];

const PRO_FEATURES = [
  'Exportar el historial de cada grupo a Excel/CSV',
  'Recordatorios automáticos de cuotas de natillera pendientes',
  'Colores de grupo personalizados',
];

const PricingPage = () => {
  const [searchParams] = useSearchParams();
  const checkoutResult = searchParams.get('checkout');
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    billingService.getBillingStatus()
      .then(setStatus)
      .catch(() => setStatus({ isPro: false }))
      .finally(() => setLoadingStatus(false));
  }, [checkoutResult]);

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

        {checkoutResult === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Listo! Tu pago se está procesando. Puede tardar unos segundos en reflejarse aquí.
          </Alert>
        )}
        {checkoutResult === 'cancel' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Cancelaste el proceso de pago. Puedes intentarlo de nuevo cuando quieras.
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ height: '100%', borderRadius: 4 }} elevation={2}>
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
            <Card sx={{ height: '100%', borderRadius: 4, border: '2px solid', borderColor: 'primary.main' }} elevation={4}>
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

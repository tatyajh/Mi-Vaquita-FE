import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import Logo from '../assets/layer-MC1.svg';

// Antes, cualquier ruta desconocida dentro de la app (link viejo,
// natillera borrada, typo en la URL) redirigía en silencio a /home sin
// explicar nada. Esta página reemplaza ese redirect silencioso.
const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: { xs: 8, sm: 12 } }}>
      <Box sx={{ width: 96, height: 96, borderRadius: '32px 32px 48px 32px', background: '#dff1d2', display: 'grid', placeItems: 'center', mx: 'auto', mb: 3, opacity: 0.7 }}>
        <img src={Logo} alt="Mi Vaquita" width={72} height={72} />
      </Box>
      <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>404</Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>Esta página se perdió en el paseo</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        El enlace puede estar roto o el contenido ya no existe.
      </Typography>
      <Button component={RouterLink} to="/home" variant="contained" size="large">
        Volver al inicio
      </Button>
    </Container>
  );
};

export default NotFoundPage;

import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import Logo from '../../assets/layer-MC1.svg';

// Shared branded, centered, responsive shell for the login/register screens.
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f7df',
        px: 2,
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ px: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: { xs: 4, sm: 6 },
            border: '1px solid #dcebbd',
            boxShadow: '0 18px 45px rgba(70, 99, 38, 0.16)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: 106, height: 106, borderRadius: '32px 32px 48px 32px', background: '#dff1d2', display: 'grid', placeItems: 'center' }}>
            <img src={Logo} alt="Mi Vaquita" width={82} height={82} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mt: 1, color: 'primary.main', fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ mt: 0.5, mb: 1, color: 'text.secondary', textAlign: 'center' }}>
              {subtitle}
            </Typography>
          )}
          <Box sx={{ width: '100%', mt: 2 }}>
            {children}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;

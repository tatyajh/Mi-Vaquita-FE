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
        background: 'linear-gradient(160deg, #ff2d78 0%, #7b2ff7 55%, #fffaf3 55%)',
        px: 2,
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ px: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 8,
            boxShadow: '0 20px 45px rgba(123, 47, 247, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={Logo} alt="Mi Vaquita" width={88} height={88} />
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

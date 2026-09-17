import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import Logo from '../assets/layer-MC1.svg';
import { getCurrentUser } from '../services/AuthService';

const HomePage = () => {
  const currentUser = getCurrentUser();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        px: 3,
        py: { xs: 4, sm: 8 },
      }}
    >
      <img src={Logo} alt="Mi Vaquita" width={100} height={100} />
      <Typography variant="h4" sx={{ mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
        {currentUser ? `¡Hola, ${currentUser.name}!` : 'Bienvenido a mi Vaquita'}
      </Typography>
      <Typography sx={{ mt: 1, mb: 4, color: 'text.secondary', maxWidth: 420 }}>
        Arma un grupo con tus amigos, anota lo que cada quien paga y deja que la vaquita saque la cuenta de quién le debe a quién.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button
          component={Link}
          to="/groups"
          variant="contained"
          color="primary"
        >
          Ver mis grupos
        </Button>
        <Button
          component={Link}
          to="/friends"
          variant="outlined"
          color="primary"
        >
          Ver mis amigos
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;

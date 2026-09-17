import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ExpensesPage = () => {
  return (
    <Box sx={{ textAlign: 'center', px: 3, py: { xs: 4, sm: 8 } }}>
      <Typography variant="h4" sx={{ color: '#36190D', fontWeight: 'bold', mb: 2 }}>
        Gastos
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Los gastos se registran dentro de cada grupo. Entra a un grupo y usa "Agregar Gasto" para anotar lo que pagaste.
      </Typography>
      <Button
        component={Link}
        to="/groups"
        variant="contained"
        sx={{ bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
      >
        Ir a mis grupos
      </Button>
    </Box>
  );
};

export default ExpensesPage;

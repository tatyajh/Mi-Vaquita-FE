import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { formatCurrency as currency } from '../../utils/currency';

const ExpenseCard = ({ expense, onDelete }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: '6px solid',
        borderColor: 'primary.main',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, height: '100%' }}>
        <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{expense.description}</Typography>
        <Typography variant="body2" color="text.secondary">Pagado por: {expense.paid_by_name}</Typography>
        <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{currency(expense.amount)}</Typography>
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
          <Button size="small" color="error" onClick={() => onDelete(expense.id)}>
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;

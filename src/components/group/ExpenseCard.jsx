import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Modal, Typography } from '@mui/material';
import { formatCurrency as currency } from '../../utils/currency';

// Íconos livianos por categoría inferida del texto de la descripción,
// sin depender de un campo de categoría real en el backend.
const CATEGORY_ICONS = [
  { emoji: '🍔', keywords: ['comida', 'almuerzo', 'cena', 'desayuno', 'restaurante', 'pizza', 'burger', 'hamburguesa'] },
  { emoji: '🍺', keywords: ['cerveza', 'trago', 'bar', 'birra', 'alcohol', 'licor'] },
  { emoji: '🚗', keywords: ['uber', 'taxi', 'gasolina', 'transporte', 'peaje', 'parqueadero'] },
  { emoji: '🏠', keywords: ['arriendo', 'alquiler', 'hospedaje', 'hotel', 'airbnb'] },
  { emoji: '🎬', keywords: ['cine', 'película', 'entrada', 'concierto', 'evento'] },
  { emoji: '🛒', keywords: ['mercado', 'super', 'supermercado', 'compras'] },
  { emoji: '✈️', keywords: ['vuelo', 'avión', 'tiquete', 'viaje'] },
];

const guessEmoji = (description = '') => {
  const text = description.toLowerCase();
  const match = CATEGORY_ICONS.find(({ keywords }) => keywords.some((k) => text.includes(k)));
  return match?.emoji || '🐄';
};

const ExpenseCard = ({ expense, onDelete }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        background: 'linear-gradient(160deg, #ffffff 0%, #fff3e2 100%)',
        borderLeft: '6px solid',
        borderColor: 'secondary.main',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>{guessEmoji(expense.description)}</Typography>
          <Typography variant="h6" sx={{ wordBreak: 'break-word', fontWeight: 700 }}>{expense.description}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Pagado por: {expense.paid_by_name}</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', color: 'primary.main' }}>{currency(expense.amount)}</Typography>

        {expense.receipt_url && (
          <Box
            component="img"
            src={expense.receipt_url}
            alt="Recibo"
            onClick={() => setPreviewOpen(true)}
            sx={{
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: 2,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: 'secondary.light',
            }}
          />
        )}

        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
          <Button size="small" color="error" onClick={() => onDelete(expense.id)}>
            Eliminar
          </Button>
        </Box>
      </CardContent>

      {expense.receipt_url && (
        <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90vw',
              maxHeight: '90vh',
              outline: 'none',
            }}
          >
            <Box
              component="img"
              src={expense.receipt_url}
              alt="Recibo en tamaño completo"
              sx={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 3, boxShadow: 8 }}
            />
          </Box>
        </Modal>
      )}
    </Card>
  );
};

export default ExpenseCard;

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatCurrency as currency } from '../../utils/currency';
import { MILK_BAG_RADIUS } from '../../utils/shape';

const CATEGORY_EMOJI = { comida: '🍔', transporte: '🚗', hospedaje: '🏠', entretenimiento: '🎉', otro: '🧾' };
const PAYMENT_LABEL = { efectivo: '💵 Efectivo', transferencia: '🏦 Transferencia', tarjeta: '💳 Tarjeta' };

// Deterministically pick a flavor color from an id/string so the same
// expense always gets the same candy accent.
const flavorForId = (flavors, id) => {
  const keys = Object.keys(flavors);
  const str = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return flavors[keys[hash % keys.length]];
};

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
  const theme = useTheme();
  const accentColor = flavorForId(theme.palette.flavors, expense.id);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: MILK_BAG_RADIUS,
        overflow: 'hidden',
        background: `linear-gradient(160deg, #ffffff 0%, ${accentColor}22 100%)`,
        boxShadow: `0 10px 22px ${accentColor}55`,
        borderTop: '8px solid',
        borderColor: accentColor,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, height: '100%', p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{ fontSize: '1.7rem', lineHeight: 1 }}>
            {CATEGORY_EMOJI[expense.category] || guessEmoji(expense.description)}
          </Typography>
          <Typography variant="h6" sx={{ wordBreak: 'break-word', fontWeight: 800 }}>{expense.description}</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Pagado por: {expense.paid_by_name}</Typography>
        <Typography sx={{ fontWeight: 900, fontSize: '1.7rem', color: accentColor }}>{currency(expense.amount)}</Typography>
        {expense.payment_method && (
          <Chip
            size="small"
            label={PAYMENT_LABEL[expense.payment_method] || expense.payment_method}
            sx={{ alignSelf: 'flex-start', bgcolor: `${accentColor}22`, fontWeight: 700 }}
          />
        )}

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
              borderRadius: 3,
              cursor: 'pointer',
              border: '2px solid',
              borderColor: accentColor,
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

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, MenuItem, Modal, TextField, Typography, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';

export const CATEGORIES = [
  { value: 'comida', label: 'Comida', emoji: '🍔' },
  { value: 'transporte', label: 'Transporte', emoji: '🚗' },
  { value: 'hospedaje', label: 'Hospedaje', emoji: '🏠' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎉' },
  { value: 'otro', label: 'Otro', emoji: '🧾' },
];

const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo', icon: <PaymentsOutlinedIcon fontSize="small" /> },
  { value: 'transferencia', label: 'Transferencia', icon: <AccountBalanceOutlinedIcon fontSize="small" /> },
  { value: 'tarjeta', label: 'Tarjeta', icon: <CreditCardOutlinedIcon fontSize="small" /> },
];

const AddExpenseModal = ({ open, onClose, onAddExpense, members, currentUserId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidByUserId, setPaidByUserId] = useState(currentUserId ?? '');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [category, setCategory] = useState('otro');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setDescription('');
      setAmount('');
      setPaidByUserId(currentUserId ?? (members[0]?.userId ?? ''));
      setReceiptFile(null);
      setReceiptPreview(null);
      setCategory('otro');
      setPaymentMethod('efectivo');
    }
  }, [open, currentUserId, members]);

  useEffect(() => {
    // Preview client-side inmediata vía URL.createObjectURL, sin
    // depender de que el upload al backend funcione.
    if (!receiptFile) {
      setReceiptPreview(null);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(receiptFile);
    setReceiptPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [receiptFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setReceiptFile(file || null);
  };

  const handleSubmit = () => {
    if (!description.trim() || !amount || Number(amount) <= 0 || !paidByUserId) return;
    onAddExpense({
      description: description.trim(),
      amount: Number(amount),
      paidByUserId,
      receiptFile,
      category,
      paymentMethod,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: '80%', md: 420 },
          maxWidth: '95vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
          borderRadius: 5,
          background: 'linear-gradient(165deg, #ffffff 0%, #fff6ea 100%)',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
          🐮 Agregar gasto
        </Typography>
        <TextField
          label="¿Qué se pagó?"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Monto"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          select
          label="¿Quién pagó?"
          fullWidth
          margin="normal"
          value={paidByUserId}
          onChange={(e) => setPaidByUserId(e.target.value)}
        >
          {members.map((member) => (
            <MenuItem key={member.userId} value={member.userId}>
              {member.name || member.email}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, mb: 0.5, fontWeight: 700, color: 'text.secondary' }}>
          Categoría
        </Typography>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(e, val) => val && setCategory(val)}
          sx={{ flexWrap: 'wrap', gap: 1, '& .MuiToggleButton-root': { borderRadius: 999, border: '2px solid', borderColor: 'divider' } }}
        >
          {CATEGORIES.map((c) => (
            <ToggleButton key={c.value} value={c.value} sx={{ px: 1.5 }}>
              {c.emoji} {c.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="caption" sx={{ display: 'block', mt: 2, mb: 0.5, fontWeight: 700, color: 'text.secondary' }}>
          Medio de pago
        </Typography>
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={(e, val) => val && setPaymentMethod(val)}
          sx={{ gap: 1, '& .MuiToggleButton-root': { borderRadius: 999, border: '2px solid', borderColor: 'divider' } }}
        >
          {PAYMENT_METHODS.map((m) => (
            <ToggleButton key={m.value} value={m.value} sx={{ px: 1.5, gap: 0.5 }}>
              {m.icon} {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ mt: 2, width: '100%' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
          {receiptPreview ? (
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Box
                component="img"
                src={receiptPreview}
                alt="Vista previa del recibo"
                sx={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 3, border: '2px solid', borderColor: 'secondary.light' }}
              />
              <IconButton
                size="small"
                onClick={() => setReceiptFile(null)}
                sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'background.paper' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<AddAPhotoIcon sx={{ fontSize: '1.8rem !important' }} />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                py: 1.5,
                borderWidth: 2,
                borderColor: 'primary.main',
                color: 'primary.main',
                fontWeight: 800,
                fontSize: '1rem',
                '&:hover': {
                  borderWidth: 2,
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                },
              }}
            >
              📎 Adjuntar recibo (foto o imagen)
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Guardar
        </Button>
      </Box>
    </Modal>
  );
};

export default AddExpenseModal;

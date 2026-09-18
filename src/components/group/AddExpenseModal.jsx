import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Modal, TextField, Typography } from '@mui/material';

const AddExpenseModal = ({ open, onClose, onAddExpense, members, currentUserId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidByUserId, setPaidByUserId] = useState(currentUserId ?? '');

  useEffect(() => {
    if (open) {
      setDescription('');
      setAmount('');
      setPaidByUserId(currentUserId ?? (members[0]?.userId ?? ''));
    }
  }, [open, currentUserId, members]);

  const handleSubmit = () => {
    if (!description.trim() || !amount || Number(amount) <= 0 || !paidByUserId) return;
    onAddExpense({ description: description.trim(), amount: Number(amount), paidByUserId });
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
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Agregar gasto
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

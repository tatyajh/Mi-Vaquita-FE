import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Modal, Typography } from '@mui/material';

const MAX_GROUP_MEMBERS = 20;

const AddFriendsModal = ({ open, onClose, onAddFriends, friends, currentMemberCount = 0 }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedFriends([]);
    setError('');
  }, [open]);

  const remainingSlots = Math.max(MAX_GROUP_MEMBERS - currentMemberCount, 0);

  const handleToggleFriend = (friendId) => {
    setError('');
    setSelectedFriends(prev => {
      const isSelected = prev.includes(friendId);
      if (isSelected) {
        return prev.filter(id => id !== friendId);
      }
      if (prev.length >= remainingSlots) {
        setError(`Un grupo puede tener como máximo ${MAX_GROUP_MEMBERS} integrantes. Solo puedes agregar ${remainingSlots} más.`);
        return prev;
      }
      return [...prev, friendId];
    });
  };

  const handleAddFriends = () => {
    if (selectedFriends.length === 0) {
      setError('Elige al menos a un amigo para continuar.');
      return;
    }
    if (selectedFriends.length > remainingSlots) {
      setError(`Un grupo puede tener como máximo ${MAX_GROUP_MEMBERS} integrantes.`);
      return;
    }
    onAddFriends(selectedFriends);
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
          width: { xs: '90%', sm: '80%', md: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Elige al menos a un amigo para continuar.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          Cupos disponibles en el grupo: {remainingSlots} de {MAX_GROUP_MEMBERS}
        </Typography>
        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {friends.map((friend) => (
            <FormControlLabel
              key={friend.id}
              control={<Checkbox checked={selectedFriends.includes(friend.id)} onChange={() => handleToggleFriend(friend.id)} />}
              label={`${friend.email}`}
            />
          ))}
        </Box>
        {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFriends}
          disabled={remainingSlots === 0}
          sx={{ mt: 2, width: '100%' }}
        >
          Agregar
        </Button>
      </Box>
    </Modal>
  );
};

export default AddFriendsModal;

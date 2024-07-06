import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Modal, Typography } from '@mui/material';

const AddFriendsModal = ({ open, onClose, onAddFriends, friends }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    setSelectedFriends([]);
  }, [open]);

  const handleToggleFriend = (friendId) => {
    setSelectedFriends(prev => {
      const isSelected = prev.includes(friendId);
      if (isSelected) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleAddFriends = () => {
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
          borderRadius: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          Elige al menos a un amigo para continuar.
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
        <Button
          variant="contained"
          onClick={handleAddFriends}
          sx={{ mt: 2, width: '100%', bgcolor: '#36190D', '&:hover': { bgcolor: '#59382e' } }}
        >
          Agregar
        </Button>
      </Box>
    </Modal>
  );
};

export default AddFriendsModal;

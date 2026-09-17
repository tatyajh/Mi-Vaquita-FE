import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';

const initials = (name = '', email = '') => (name || email || '?').trim().charAt(0).toUpperCase();

const FriendCard = ({ friend, onDelete }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '6px solid',
        borderColor: 'secondary.main',
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{initials(friend.name, friend.email)}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, wordBreak: 'break-word' }}>{friend.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {friend.email}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
          <Button size="small" color="error" onClick={() => onDelete(friend.id)}>
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FriendCard;

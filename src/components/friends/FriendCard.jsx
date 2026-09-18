import React from 'react';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const initials = (name = '', email = '') => (name || email || '?').trim().charAt(0).toUpperCase();

// Deterministically pick a flavor color from an id/string so the same
// friend always gets the same candy accent.
const flavorForId = (flavors, id) => {
  const keys = Object.keys(flavors);
  const str = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return flavors[keys[hash % keys.length]];
};

const FriendCard = ({ friend, onDelete }) => {
  const theme = useTheme();
  const accentColor = flavorForId(theme.palette.flavors, friend.id);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: `0 10px 22px ${accentColor}55`,
        background: `linear-gradient(160deg, ${accentColor}33 0%, ${accentColor}0d 100%)`,
        borderTop: '8px solid',
        borderColor: accentColor,
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: accentColor, width: 48, height: 48, fontWeight: 800, fontSize: '1.2rem' }}>
            {initials(friend.name, friend.email)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', wordBreak: 'break-word' }}>{friend.name}</Typography>
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

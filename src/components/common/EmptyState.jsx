import React from 'react';
import { Box, Button, Typography } from '@mui/material';

/**
 * Shared empty-state block: icon/illustration + headline + body + optional CTA.
 * Used wherever a list can be empty (groups, friends, expenses, balances).
 */
const EmptyState = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.5,
        px: 3,
        py: { xs: 4, sm: 6 },
        color: 'text.secondary',
      }}
    >
      {icon && (
        <Box sx={{ fontSize: 48, lineHeight: 1, color: 'secondary.dark' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
        {title}
      </Typography>
      {description && (
        <Typography sx={{ maxWidth: 480, whiteSpace: 'pre-line' }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ mt: 1 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

/**
 * Shared page header: title + optional subtitle + optional primary action.
 * Keeps typography/spacing consistent across GroupsPage, FriendsPage, etc.
 */
const PageHeader = ({ title, subtitle, actionLabel, onAction, actionIcon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        px: { xs: 2, sm: 3 },
        pt: { xs: 2, sm: 3 },
        pb: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5, maxWidth: 480 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={actionIcon}
          onClick={onAction}
          sx={{ px: 3 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;

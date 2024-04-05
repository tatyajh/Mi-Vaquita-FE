import React from 'react';
import Button from '@mui/material/Button';

const NewGroupButton = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
        Nuevo Grupo
    </Button>
  );
};

export default NewGroupButton;

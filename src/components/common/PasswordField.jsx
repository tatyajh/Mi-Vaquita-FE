import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  const label = visible ? 'Ocultar contraseña' : 'Ver contraseña';
  return <TextField
    {...props}
    type={visible ? 'text' : 'password'}
    InputProps={{
      ...props.InputProps,
      endAdornment: <InputAdornment position="end"><Tooltip title={label}><IconButton edge="end" onClick={() => setVisible(value => !value)} aria-label={label}>{visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></Tooltip></InputAdornment>,
    }}
  />;
}

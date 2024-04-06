import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const LoginPage = () => {
  let navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate('/home')}>Entrar</Button>
    </div>
  );
};

export default LoginPage;
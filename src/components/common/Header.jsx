import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css'; 

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#36190D' }}>
      <Toolbar>
        <Typography variant="h6" className={styles.title}>
          <Link to="/" className={styles.link}>
            Mi Vaquita
          </Link>
        </Typography>
        <Link to="/friends" className={styles.link}>
          Amig@s
        </Link>
        <Link to="/expenses" className={styles.link}>
          Gastos
        </Link>
        <Link to="/groups" className={styles.link}>
          Grupos
        </Link>
        <IconButton color="inherit" className={styles.icon}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

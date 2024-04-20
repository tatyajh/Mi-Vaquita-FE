import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from '../../styles/Header.module.css';
import Logo from '../../assets/layer-MC1.svg';

const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#36190D' }}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.logoAndTitle}>
          <img src={Logo} alt="Mi Vaquita" className={styles.logo} />
          <Typography variant="h6" component="div" fontSize={'22px'} fontWeight={700}>
            Mi Vaquita
          </Typography>
        </Box>
        <Box className={styles.navigation}>
          <Link to="/friends" className={`${styles.link} ${location.pathname === '/friends' ? styles.active : ''}`}>
            Amig@s
          </Link>
          <Link to="/expenses" className={`${styles.link} ${location.pathname === '/expenses' ? styles.active : ''}`}>
            Gastos
          </Link>
          <Link to="/groups" className={`${styles.link} ${location.pathname === '/groups' ? styles.active : ''}`}>
            Grupos
          </Link>
        </Box>
        <IconButton color="inherit" component={Link} to="/login" className={styles.icon}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

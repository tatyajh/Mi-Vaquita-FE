import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from '../../styles/Header.module.css';
import Logo from '../../assets/layer-MC1.svg';
import { getCurrentUser, logout } from '../../services/AuthService';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar className={styles.toolbar}>
        <Box component={Link} to="/groups" className={styles.logoAndTitle} sx={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={Logo} alt="Mi Vaquita" className={styles.logo} />
          <Typography variant="h6" component="div" fontSize={'22px'} fontWeight={700}>
            Mi Vaquita
          </Typography>
        </Box>
        <Box className={styles.navigation}>
          <Link to="/friends" className={`${styles.link} ${location.pathname === '/friends' ? styles.active : ''}`}>
            Amig@s
          </Link>
          <Link to="/groups" className={`${styles.link} ${location.pathname === '/groups' ? styles.active : ''}`}>
            Grupos
          </Link>
        </Box>
        <Tooltip title={currentUser ? `Cerrar sesión (${currentUser.name})` : 'Cerrar sesión'}>
          <IconButton color="inherit" onClick={handleLogout} className={styles.icon}>
            <LogoutIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

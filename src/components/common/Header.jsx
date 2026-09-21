import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import LogoutIcon from '@mui/icons-material/Logout';
import styles from '../../styles/Header.module.css';
import Logo from '../../assets/layer-MC1.svg';
import { getCurrentUser, logout } from '../../services/AuthService';
import ChangePasswordModal from '../account/ChangePasswordModal';
import DeactivateAccountModal from '../account/DeactivateAccountModal';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const handleLogout = () => {
    setMenuAnchor(null);
    logout();
    navigate('/login');
  };

  const handleDeactivated = () => {
    setDeactivateOpen(false);
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar className={styles.toolbar}>
          <Box component={Link} to="/home" className={styles.logoAndTitle} sx={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={Logo} alt="Mi Vaquita" className={styles.logo} />
            <Typography variant="h6" component="div" fontSize={'22px'} fontWeight={700}>
              Mi Vaquita
            </Typography>
          </Box>
          <Box component="nav" aria-label="Navegación principal" className={styles.navigation}>
            <Link to="/home" className={`${styles.link} ${location.pathname === '/home' ? styles.active : ''}`}>
              Inicio
            </Link>
            <Link to="/friends" className={`${styles.link} ${location.pathname === '/friends' ? styles.active : ''}`}>
              Amig@s
            </Link>
            <Link to="/groups" className={`${styles.link} ${location.pathname === '/groups' ? styles.active : ''}`}>
              Grupos
            </Link>
            <Link to="/natilleras" className={`${styles.link} ${location.pathname.startsWith('/natilleras') ? styles.active : ''}`}>
              Natilleras
            </Link>
            <Link to="/activities" className={`${styles.link} ${location.pathname.startsWith('/activities') ? styles.active : ''}`}>
              Actividades
            </Link>
          </Box>
          <Tooltip title={currentUser ? `Cuenta (${currentUser.name})` : 'Cuenta'}>
            <IconButton
              color="inherit"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              className={styles.icon}
              aria-label="Menú de cuenta"
            >
              <AccountCircleIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setChangePasswordOpen(true);
              }}
            >
              <ListItemIcon>
                <LockResetIcon fontSize="small" />
              </ListItemIcon>
              Cambiar contraseña
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setDeactivateOpen(true);
              }}
              sx={{ color: 'error.dark' }}
            >
              <ListItemIcon>
                <PersonOffIcon fontSize="small" color="error" />
              </ListItemIcon>
              Darse de baja
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
      <DeactivateAccountModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onDeactivated={handleDeactivated}
      />
    </>
  );
};

export default Header;

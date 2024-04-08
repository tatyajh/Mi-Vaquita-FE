import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from '../../styles/Header.module.css'; 
import Logo from '../../assets/layer-MC1.svg';

const Header = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#36190D' }}>
      <Toolbar className={styles.toolbar}>
        <img src={Logo} alt="Mi Vaquita" className={styles.logo} />
        <Typography variant="h3" sx={{fontWeight: 700}}>
          Mi Vaquita
        </Typography>
              <div className={styles.navigation}>
          <Link to="/friends" className={`${styles.link} ${location.pathname === '/friends' ? styles.active : ''}`}>
            Amig@s
          </Link>
          <Link to="/expenses" className={`${styles.link} ${location.pathname === '/expenses' ? styles.active : ''}`}>
            Gastos
          </Link>
          <Link to="/groups" className={`${styles.link} ${location.pathname === '/groups' ? styles.active : ''}`}>
            Grupos
          </Link>
        </div>
        <IconButton color="inherit" component={Link} to="/login" className={styles.icon}>
        <AccountCircleIcon fontSize="large" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const destinations = [
  { label: 'Inicio', path: '/home', icon: <HomeOutlinedIcon /> },
  { label: 'Calendario', path: '/calendario', icon: <CalendarMonthOutlinedIcon /> },
  { label: 'Grupos', path: '/groups', icon: <GroupsOutlinedIcon /> },
  { label: 'Natilleras', path: '/natilleras', icon: <SavingsOutlinedIcon /> },
];

const moreItems = [
  { label: 'Amig@s', path: '/friends', icon: <PeopleOutlineIcon /> },
  { label: 'Actividades', path: '/activities', icon: <CelebrationOutlinedIcon /> },
  { label: 'Mis préstamos', path: '/mis-prestamos', icon: <AccountBalanceWalletOutlinedIcon /> },
];

export default function MobileNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const active = destinations.find((item) => pathname.startsWith(item.path))?.path || 'more';

  const go = (path) => { setOpen(false); navigate(path); };
  return <>
    <Box sx={{ display: { xs: 'block', md: 'none' }, height: 76 }} />
    <BottomNavigation
      value={active}
      onChange={(_, value) => value === 'more' ? setOpen(true) : go(value)}
      showLabels
      sx={{
        display: { xs: 'flex', md: 'none' }, position: 'fixed', zIndex: 1200,
        left: 0, right: 0, bottom: 0, height: 68, borderTop: '1px solid #d8e7b5',
        boxShadow: '0 -6px 20px rgba(55,75,24,.1)', pb: 'env(safe-area-inset-bottom)',
        '& .MuiBottomNavigationAction-root': { minWidth: 0, minHeight: 56, px: .25 },
        '& .MuiBottomNavigationAction-label': { fontSize: '.68rem' },
      }}
    >
      {destinations.map((item) => <BottomNavigationAction key={item.path} value={item.path} label={item.label} icon={item.icon} />)}
      <BottomNavigationAction value="more" label="Más" icon={<MoreHorizIcon />} />
    </BottomNavigation>
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: '24px 24px 0 0', pb: 2 } }}>
      <Box sx={{ width: 46, height: 5, borderRadius: 3, bgcolor: 'grey.300', mx: 'auto', my: 1.5 }} />
      <List sx={{ px: 1 }}>
        {moreItems.map((item) => <ListItemButton key={item.path} onClick={() => go(item.path)} sx={{ minHeight: 52, borderRadius: 3 }}>
          <ListItemIcon>{item.icon}</ListItemIcon><ListItemText primary={item.label} />
        </ListItemButton>)}
      </List>
      <Divider />
    </Drawer>
  </>;
}

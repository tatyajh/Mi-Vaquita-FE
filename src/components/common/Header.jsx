// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/friends">Amigos</Link></li>
        <li><Link to="/expenses">Gastos</Link></li>
        <li><Link to="/groups">Grupos</Link></li>
      </ul>
    </nav>
  );
};

export default Header;

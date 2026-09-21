import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

// Antes de este test, el frontend tenía cero cobertura. Este es un piso
// mínimo: confirma que la pantalla de login renderiza sin explotar y que
// los elementos clave del flujo (correo, contraseña, botón, links legales)
// están presentes.
test('renders the login form with its key fields and links', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  expect(screen.getByLabelText('Correo *')).toBeInTheDocument();
  expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /términos/i })).toHaveAttribute('href', '/terminos');
  expect(screen.getByRole('link', { name: /privacidad/i })).toHaveAttribute('href', '/privacidad');
});

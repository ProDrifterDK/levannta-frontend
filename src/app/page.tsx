'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Container } from '@mui/material';

export default function HomePage() {
  return (
    <>

      {/* Contenido principal */}
      <Container sx={{ marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido a Levannta
        </Typography>
        <Typography variant="body1" paragraph>
          Usa la barra de navegación para acceder a las funcionalidades disponibles:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">
              <Link href="/portfolio" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Cargar Cartera
              </Link>{' '}
              - Sube la cartera de tus clientes y calcula el máximo adelanto.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <Link href="/apply-loan" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Solicitar Adelanto
              </Link>{' '}
              - Solicita un adelanto basado en tu cartera.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <Link href="/loan-status" style={{ textDecoration: 'none', color: '#1976d2' }}>
                Estado del Préstamo
              </Link>{' '}
              - Consulta el estado actual de tu solicitud.
            </Typography>
          </li>
        </ul>
      </Container>
    </>
  );
}

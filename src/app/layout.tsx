import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ThemeProviderClient from './ThemeProviderClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProviderClient>
          {/* Navbar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Levannta
              </Typography>
              <Button color="inherit" component={Link} href="/portfolio">
                Cargar Cartera
              </Button>
              <Button color="inherit" component={Link} href="/apply-loan">
                Solicitar Adelanto
              </Button>
              <Button color="inherit" component={Link} href="/loan-status">
                Estado del Préstamo
              </Button>
            </Toolbar>
          </AppBar>

          {/* Contenido principal */}
          <Container sx={{ marginTop: '2rem' }}>{children}</Container>
        </ThemeProviderClient>
      </body>
    </html>
  );
}

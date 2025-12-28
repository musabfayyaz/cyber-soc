'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { SessionProvider } from 'next-auth/react';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <body>
            {children}
          </body>
        </ThemeProvider>
      </SessionProvider>
    </html>
  );
}

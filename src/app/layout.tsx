import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { CssBaseline } from '@mui/material';
import { AppThemeProvider } from '@/shared/context/themeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Notinha',
  description: 'Seu aplicativo de consulta de preços reais',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='pt-BR'>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      </style>
      <body className={inter.className} style={{ height: '100vh' }}>
        <CssBaseline />
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
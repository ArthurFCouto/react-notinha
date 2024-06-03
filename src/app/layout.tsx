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
      <body className={inter.className} style={{ height: '100vh' }}>
        <CssBaseline />
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
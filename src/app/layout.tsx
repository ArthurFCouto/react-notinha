import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import { Metadata } from 'next';
import { AppThemeProvider } from '@/shared/context/themeContext';

export const metadata: Metadata = {
  applicationName: 'Notinha',
  description: 'Seu aplicativo de consulta de preços reais',
  icons: '/icon.png',
  title: 'Notinha',
  keywords: ['Precos', 'Mercado', 'Consulta'],
  authors: [{ name: 'Arthur F Couto', url: 'https://instagram.com/arthur_fcouto' }],
  creator: 'Arthur F Couto',
  publisher: 'Arthur F Couto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='pt-BR'>
      <body>
        <AppThemeProvider >
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
};
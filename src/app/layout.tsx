import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notinha',
  description: 'Seu aplicativo de consulta de preços reais',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body>{children}</body>
    </html>
  );
}
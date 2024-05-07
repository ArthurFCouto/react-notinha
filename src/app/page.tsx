'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

export default function Home() {
  const router = useRouter()
  useEffect(() => router.push('/home', { scroll: false }), []);

  return (
    <Box display='flex' justifyContent='center' alignItems='center' width='100%' height='100%'>
      <Typography gutterBottom>Você será redirecionado em breve...</Typography>
      <Button LinkComponent={Link} href='/home'>Redirecionar agora</Button>
    </Box>
  );
}

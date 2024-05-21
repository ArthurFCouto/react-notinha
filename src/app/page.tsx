'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Fab, Typography } from '@mui/material';
import { Navigation } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieLoading from '@/shared/assets/loading.json';

export default function Home() {

  const router = useRouter();
  const redirect = () => router.push('/home');
  useEffect(() => redirect(), []);

  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      height='100%'
      justifyContent='center'
      width='100%'
      sx={{
        backgroundImage: 'url(https://source.unsplash.com/800x600/?mercado)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Typography
        color='white'
        gutterBottom
        sx={{ textShadow: '-1px -1px 4px #101010' }}
        variant={'h4'}
      >
        Você será redirecionado em breve...
      </Typography>
      <Player
        autoplay
        keepLastFrame
        loop
        src={lottieLoading}
        style={{
          height: 150,
          width: 150
        }}
      />
      <Fab color='primary' variant='extended' onClick={redirect}>
        <Navigation sx={{ mr: 1 }} />
        Navegar
      </Fab>
    </Box>
  );
}
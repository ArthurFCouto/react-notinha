'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Player } from '@lottiefiles/react-lottie-player';
import loading from '../util/lottiefiles/loading.json';

export default function Home() {
  const router = useRouter()
  const theme = useTheme();
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const sizeAnimation = smDownScreen ? '150px' : '250px';
  useEffect(() => router.push('/home'), []);

  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      gap={1}
      justifyContent='center'
      height='100%'
    >
      <Typography gutterBottom variant='h5'>
        Você será redirecionado em breve...
      </Typography>
      <Player
        autoplay
        keepLastFrame
        loop
        src={loading}
        style={{
          height: sizeAnimation,
          width: sizeAnimation
        }}
      />
      <Button
        LinkComponent={Link}
        href='/home'
        variant='contained'>
        Acessar Agora
      </Button>
    </Box>
  );
}

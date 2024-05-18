'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieLoading from '../assets/loading.json';

export default function Home() {
  const router = useRouter()
  const theme = useTheme();
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const sizeAnimation = smDownScreen ? '150px' : '750px';
  useEffect(() => router.push('/home'), []);

  return (
    <Grid container >
      <Grid
        color='white'
        display='flex'
        height='100vh'
        item
        paddingX={3}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/1280x960/?mercado)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
        xs={12}
      >
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          width='100%'
        >
          <Typography
            gutterBottom
            sx={{ textShadow: '-1px -1px 4px #101010' }}
            variant={smDownScreen ? 'h5' : 'h4'}
          >
            Você será redirecionado em breve...
          </Typography>
          <Button
            LinkComponent={Link}
            color='primary'
            href='/home'
            size='large'
            sx={{ marginY: 5 }}
            variant='contained'
          >
            Ir Agora
          </Button>
          <Player
            autoplay
            keepLastFrame
            loop
            src={lottieLoading}
            style={{
              height: sizeAnimation,
              width: sizeAnimation
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
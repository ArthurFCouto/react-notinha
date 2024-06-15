'use client';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import AppBar from '@/shared/components/root/AppBar';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieNotinha from '@/shared/assets/notinha.json';

export default function Home() {
  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      height='100%'
    >
      <AppBar />
      <Grid
        container
        flex={1}
        marginTop={10}
        paddingX={3}
        spacing={2}
      >
        <Grid
          display='flex'
          flexDirection='column'
          item
          justifyContent='center'
          md={6}
          paddingLeft={0}
          xs={12}
        >
          <Typography fontWeight={500} variant='h3' gutterBottom>Preços do mercado em tempo real e na palma da sua mão</Typography>
          <Typography variant='h5' gutterBottom>Acompanhe o valor dos produtos no mercado sem sair de casa, veja o histórico de preços, promoções divulgadas e nos ajude a atualizar.</Typography>
          <Stack width='100%' alignItems='end'>
            <Button
              href='/home'
              sx={{ marginTop: 1 }}
              variant='contained'
            >
              Conhecer
            </Button>
          </Stack>
        </Grid>
        <Grid
          alignItems='center'
          display='flex'
          flexDirection='column'
          item
          justifyContent='center'
          md={6}
          paddingLeft={0}
          xs={12}
        >
          <Player
            autoplay
            keepLastFrame
            loop
            src={lottieNotinha}
            style={{
              height: 200,
              width: 200
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

const sx = {
  mainBox: {
    backgroundImage: 'url(https://source.unsplash.com/800x600/?mercado)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed'
  }
}
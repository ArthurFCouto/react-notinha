'use client';

import { Box, Button, Grid, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import NavBar from '@/shared/components/root/NavBar';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieNotinha from '@/shared/assets/notinha.json';
import Footer from '@/shared/components/footer';

export default function Home() {
  const theme = useTheme();
  const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
  const sizeAnimation = mdDownScreen ? 175 : 250;

  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
      height='100%'
    >
      <Box
        display='flex'
        flexDirection='column'
        height='100%'
        maxWidth='lg'
        paddingX={1.5}
      >
        <NavBar />
        <Grid
          container
          marginTop={theme.spacing(12)}
        >
          <Grid
            display='flex'
            flexDirection='column'
            item
            justifyContent='center'
            md={6}
            paddingLeft={0}
            paddingY={mdDownScreen ? 6 : 0}
            xs={12}
          >
            <Typography
              component='h1'
              fontWeight={600}
              gutterBottom
              lineHeight={1.15}
              textAlign={mdDownScreen ? 'center' : 'start'}
              variant={mdDownScreen ? 'h3' : 'h2'}
            >
              Os preços dos mercados na palma da sua mão
            </Typography>
            <Typography
              marginTop={mdDownScreen ? 2 : 0}
              variant='h5'
              gutterBottom
            >
              Saiba quanto irá gastar antes de sair de casa, acompanhe os valores dos mercados em tempo real.
            </Typography>
            <Stack
              alignItems={mdDownScreen ? 'center' : 'end'}
              marginTop={2}
              width='100%'
            >
              <Button
                href='/home'
                size='large'
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
            paddingY={mdDownScreen ? 3 : 0}
            xs={12}
          >
            <Player
              autoplay
              keepLastFrame
              loop
              src={lottieNotinha}
              style={{
                height: sizeAnimation,
                width: sizeAnimation
              }}
            />
          </Grid>
          <Grid
            alignItems='center'
            display='flex'
            flexDirection='column'
            item
            justifyContent='center'
            paddingLeft={0}
            paddingY={6}
            xs={12}
          >
            <Paper
              component={Box}
              paddingX={3}
              paddingY={3}
              width='100%'
            >
              <Typography textAlign='center' variant='subtitle1'>
                Acompanhe o histórico dos preços, compare-os em diferentes mercados, acompanhe quanto tem gastado em compras, e muito mais*
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Footer />
      </Box>
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
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Box, Button, Fab, Grid,
  Paper, Stack, Typography, useMediaQuery,
  useTheme
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import Footer from '@/shared/components/root/Footer';
import NavBar from '@/shared/components/root/NavBar';
import lottieNotinha from '@/shared/assets/notinha.json';
import PriceHistoryChart from '@/shared/components/home/PriceHistoryChart';
import { getPricesByName } from '@/shared/server/actions';
import { Price } from '@/shared/service/firebase';

export default function Home() {
  const theme = useTheme();
  const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
  const sizeImage = mdDownScreen ? 250 : 375;
  const route = useRouter();
  const [chartData, setChartData] = useState<Price[]>([]);
  const goToHome = () => route.push('home');

  useEffect(() => {
    const getPrices = async () => {
      const response = await getPricesByName(names[Math.floor(Math.random() * 3)].toUpperCase());
        setChartData(response.data);
    };
    getPrices();
  }, []);

  return (
    <Box
      display='flex'
      flexDirection='column'
      height='100%'
    >
      <Box
        component='main'
        maxWidth='xl'
        marginX='auto'
        width='100%'
      >
        <NavBar />
        <Grid
          container
          height={mdDownScreen ? 'auto' : '100dvh'}
          paddingTop={mdDownScreen ? 11 : 14}
        >
          <Grid
            display='flex'
            flexDirection='column'
            item
            justifyContent='center'
            md={7}
            paddingLeft={mdDownScreen ? 0 : 2}
            paddingTop={mdDownScreen ? 6 : 0}
            xs={12}
          >
            <Typography
              component='h1'
              fontWeight={600}
              gutterBottom
              lineHeight={1.2}
              letterSpacing={-1.5}
              textAlign={mdDownScreen ? 'center' : 'start'}
              variant={mdDownScreen ? 'h3' : 'h2'}
            >
              Descubra o segredo dos melhores preços
            </Typography>
            <Typography
              marginTop={mdDownScreen ? 3 : 1}
              gutterBottom
              textAlign={mdDownScreen ? 'center' : 'start'}
              variant={mdDownScreen ? 'h5' : 'h4'}
            >
              Saiba onde encontrar os menores preços para sua lista de compras.
            </Typography>
            <Stack
              alignItems={mdDownScreen ? 'center' : 'end'}
              marginTop={2}
              width='100%'
            >
              <Button
                onClick={goToHome}
                size='large'
                variant='contained'
                sx={{
                  borderRadius: '50px',
                  fontSize: 14,
                  fontWeight: 600,
                  paddingX: 3,
                  paddingY: 2
                }}
              >
                Conheça agora - É grátis
              </Button>
            </Stack>
          </Grid>
          <Grid
            alignItems='center'
            display='flex'
            item
            justifyContent='center'
            md={5}
            paddingLeft={0}
            paddingY={mdDownScreen ? 3 : 0}
            xs={12}
          >
            <Image
              alt='Carrinho de compras'
              height={sizeImage}
              src='/cart.png'
              width={sizeImage}
            />
          </Grid>
          <Grid
            display='flex'
            item
            justifyContent='center'
            paddingLeft={0}
            paddingY={mdDownScreen ? 3 : 0}
            xs={12}
          >
            <Typography
              color='primary.dark'
              textAlign='center'
              variant='h5'
            >
              Compare preços de vários mercados em um só lugar e economize nas suas compras!
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          marginBottom={4}
          paddingX={1}
          rowGap={3}
        >
          <Grid
            display='flex'
            flexDirection='column'
            rowGap={3}
            item
            justifyContent='center'
            paddingLeft={0}
            md={5}
            xs={12}
          >
            <Player
              autoplay
              keepLastFrame
              loop
              src={lottieNotinha}
              style={{
                height: sizeImage,
                width: sizeImage
              }}
            />
            <Typography
              marginTop={mdDownScreen ? 2 : 0}
              variant={mdDownScreen ? 'h5' : 'h4'}
              textAlign='center'
            >
              Acompanhe a variação dos preços dos produtos de forma <strong>Fácil</strong> e <strong>Intuitiva</strong>.
            </Typography>
          </Grid>
          <Grid
            item
            paddingLeft={0}
            md={7}
            xs={12}
          >
            {
              (chartData.length > 0) && (
                <Paper
                  component={Box}
                  display='flex'
                  flexDirection='column'
                  paddingX={3}
                  paddingY={3}
                  rowGap={3}
                  width='100%'
                >
                  <Typography gutterBottom textAlign='center' width='100%' variant='h6'>
                    Evolução do preço da <strong>{chartData[0].produto}</strong>
                  </Typography>
                  <Typography color='primary.dark' textAlign='center' width='100%' variant='h6'>
                    {chartData[0].mercado}
                  </Typography>
                  <PriceHistoryChart height={300} prices={chartData} />
                </Paper>
              )
            }
          </Grid>
          <Grid
            item
            paddingLeft={0}
            xs={12}
          >
            <Paper
              component={Box}
              marginY={3}
              paddingX={3}
              paddingY={6}
              width='100%'
            >
              <Typography textAlign='center' variant='h5'>
              Tenha acesso ao histórico de preços, controle seus gastos, compare valores em diferentes mercados e faça escolhas inteligentes para poupar dinheiro.
              </Typography>
            </Paper>
          </Grid>
          <Grid
            display='flex'
            item
            paddingLeft={0}
            position='relative'
            xs={12}
          >
            <img
              src='/market.jpg'
              alt='Corredor de mercado'
              loading='lazy'
              width='90%'
              style={{
                borderRadius: '10px',
                filter: 'blur(4px)',
                margin: 'auto'
              }}
            />
            <Fab
              color='primary'
              onClick={goToHome}
              variant='extended'
              sx={{
                fontSize: 14,
                fontWeight: 600,
                left: '25%',
                paddingX: 3,
                paddingY: 2,
                position: 'absolute',
                right: '25%',
                top: '50%'
              }}
            >
              <Search />
              Experimente
            </Fab>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

const names = ['Banana Prata', 'Laranja kg', 'Leite cond pir 39'];
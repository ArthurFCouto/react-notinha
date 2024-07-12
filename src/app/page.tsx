'use client';

import Image from 'next/image';
import {
  Box, Button, Fab, Grid,
  Paper, Stack, Typography, useMediaQuery,
  useTheme
} from '@mui/material';
import Footer from '@/shared/components/root/footer';
import NavBar from '@/shared/components/root/NavBar';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieNotinha from '@/shared/assets/notinha.json';
import PriceHistoryChart from '@/shared/components/home/PriceHistoryChart';
import { Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const theme = useTheme();
  const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
  const sizeImage = mdDownScreen ? 275 : 325;
  const route = useRouter();

  const goToHome = () => route.push('home');

  return (
    <Box
      display='flex'
      flexDirection='column'
      height='100%'
    >
      <Box
        component='main'
        maxWidth='lg'
        marginX='auto'
        padding={1.5}
        width='100%'
      >
        <NavBar />
        <Grid
          container
          height={mdDownScreen ? 'auto' : '100dvh'}
          paddingTop={mdDownScreen ? 9 : 12}
        >
          <Grid
            display='flex'
            flexDirection='column'
            item
            justifyContent='center'
            md={7}
            paddingLeft={0}
            paddingY={mdDownScreen ? 6 : 0}
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
              O segredo para encontrar os melhores preços
            </Typography>
            <Typography
              marginTop={mdDownScreen ? 2 : 1}
              gutterBottom
              textAlign={mdDownScreen ? 'center' : 'start'}
              variant={mdDownScreen ? 'h5' : 'h4'}
            >
              Descubra onde encontrar os melhores preços para os produtos da sua lista de compras.
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
            <Typography color='primary' textAlign='center' variant='h5'>
              Compare preços de diversos mercados em um só lugar e encontre a melhor opção para suas compras!
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          marginBottom={4}
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
              Acompanhar a evolução dos preços dos produtos nos mercados nunca foi tão fácil.
            </Typography>
          </Grid>
          <Grid
            item
            paddingLeft={0}
            md={7}
            xs={12}
          >
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
                Evolução do preço da <strong>Banana Prata</strong>
              </Typography>
              <PriceHistoryChart height={300} prices={prices} />
              <Typography color='primary' textAlign='center' width='100%' variant='h6'>
                SUPERMERCADO JACI
              </Typography>
            </Paper>
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
                Tenha acesso ao histórico de preços, compare preços em diversos mercado, acompanhe seus gastos e faça escolhas inteligentes que economizam seu dinheiro.
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
              //srcSet='/market.jpg?w=164&h=164&fit=crop&auto=format&dpr=2 2x'
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

const prices = [
  {
    'id': 'mLkoryZNYwxfUszxDUwv',
    'valor': '7.99',
    'idNotaFiscal': 'ol3XVRWf2zcOOgSnmo2i',
    'mercado': 'SUPERMERCADO JACI',
    'data': '25/04/2024',
    'produto': 'BANANA PRATA',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'unidadeMedida': 'KG'
  },
  {
    'id': 'm9CtgMmAxkeSt3Pg6tXd',
    'data': '02/05/2024',
    'produto': 'BANANA PRATA',
    'unidadeMedida': 'KG',
    'idNotaFiscal': 'PTmw6weDe9wmm3DeIin5',
    'valor': '6.99',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'mercado': 'SUPERMERCADO JACI'
  },
  {
    'id': 'enl5eoKPqC8ljxj8sbe6',
    'idNotaFiscal': 'amZAuVlgJJi7Hf8ko1tx',
    'mercado': 'SUPERMERCADO JACI',
    'unidadeMedida': 'KG',
    'produto': 'BANANA PRATA',
    'valor': '6.99',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'data': '08/05/2024'
  },
  {
    'id': 'CWs9IFJC0qc2q73Gs640',
    'unidadeMedida': 'KG',
    'mercado': 'SUPERMERCADO JACI',
    'data': '21/05/2024',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'idNotaFiscal': '1wKIBdozarWi55BdWxJb',
    'produto': 'BANANA PRATA',
    'valor': '5.99'
  },
  {
    'id': 'zrzTfJRfNm1p6AMXSjhj',
    'mercado': 'SUPERMERCADO JACI',
    'unidadeMedida': 'KG',
    'data': '24/05/2024',
    'produto': 'BANANA PRATA',
    'idNotaFiscal': 'gz8MDYng9fNGsP715SAH',
    'valor': '5.99',
    'idMercado': 'lsRTMlrro2wPjwkiInv1'
  },
  {
    'id': 'TXewd0zFfpoZEG6ScE4v',
    'produto': 'BANANA PRATA',
    'idNotaFiscal': 'U1FHzEOjdkwZ2dF9Bx2Q',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'unidadeMedida': 'KG',
    'valor': '5.99',
    'mercado': 'SUPERMERCADO JACI',
    'data': '26/05/2024'
  },
  {
    'id': 'BdSax9upVA6bdUntGaKK',
    'unidadeMedida': 'KG',
    'produto': 'BANANA PRATA',
    'mercado': 'SUPERMERCADO JACI',
    'idNotaFiscal': 'CvFlgpEOAgeYpn2CehpU',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'valor': '5.60',
    'data': '29/05/2024'
  },
  {
    'id': 'PLeVt88x4yxfx42VrOUu',
    'data': '04/06/2024',
    'valor': '5.60',
    'unidadeMedida': 'KG',
    'idMercado': 'lsRTMlrro2wPjwkiInv1',
    'produto': 'BANANA PRATA',
    'idNotaFiscal': 'Jk6gq9nULd0COzsh7ucB',
    'mercado': 'SUPERMERCADO JACI'
  },
  {
    'id': '9Nx7RQ0rUF9GWR6aJLF0',
    'valor': '5.60',
    'unidadeMedida': 'KG',
    'produto': 'BANANA PRATA',
    'data': '07/06/2024',
    'mercado': 'SUPERMERCADO JACI',
    'idNotaFiscal': 'HCAvMLhAeUNWbCPj92Hl',
    'idMercado': 'lsRTMlrro2wPjwkiInv1'
  }
];
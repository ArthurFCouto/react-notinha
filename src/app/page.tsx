'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Fab,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import Footer from '@/shared/components/root/footer';
import NavBar from '@/shared/components/root/NavBar';
import lottieNotinha from '@/shared/assets/notinha.json';
import PriceHistoryChart from '@/shared/components/home/PriceHistoryChart';
import { Price } from '@/server/models/price';
import axios from 'axios';
import { PriceHistory } from '@/server/models/priceHistory';

export default function Home() {
  const theme = useTheme();
  const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
  const sizeImage = mdDownScreen ? 250 : 375;
  const route = useRouter();
  const [chartData, setChartData] = useState<PriceHistory[]>([]);
  const [product, setproduct] = useState<Price>();
  //const goToHome = () => route.push('home');
  const goToHome = async () => {
    const urls = [
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31250102274225000161650040003625001183628929|2|1|1|ef43e400a0528f69be73223669f3586b98624659',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650060002747181165600338|2|1|1|ea6e9d4439c984c04ec04ff9b598c3424263c509',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240802274225000161650040003355351808952174|2|1|1|29f6b60dddcf9939eece88c0914ac8f75b9ba7a0',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240821560153000163650060000707221242875474|2|1|1|383D2AB50C874EDCBEC294CBB4B2BD93695057EB',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240803111258000153650170001407011736533020|2|1|1|A8581E86072238F1B05BC2B6C9DBF395DE5386E2',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001390961163565667|2|1|1|0A138586E26567433ACF9111BFD84D10AE9290B1',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241003111258000153650120001390971778649169|2|1|1|A2B7F850B24A782FCB223835E0FFA3CF267C4894',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241102274225000161650050002556351376442199|2|1|1|50e6199a09d5cc228354ddd05c30c1f3aff71a4c',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241121560153000163650020001802571696827498|2|1|1|F8B036BF4C1B6A98555B1E50D2BF23661AA70D11',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31241221560153000163650030001757681198084310|2|1|1|C17BF63814409E10FC3C12FB085994820A657A7C',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002663641256820902|2|1|1|e36cdc053b3b2922eb81e63e4cb09cd09271cc20',
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240603111258000153650120001159851664826624|2|1|1|2CA10AE634E7016B4ECA5484653B1ABCFAB36527',
    ];
    urls.forEach(async (url, index) => {
      if (index > 3) return;
      await axios
        .post(`/api/receipts?url=${url}`, { name: 'Arthur' })
        .then((response) => {
          console.log('Response', response.data);
        })
        .catch((error) => {
          console.error('Error', error.response);
        });
    });

    return;
    await axios
      .delete(`/api/receipts`, {
        params: {
          keys: '31250102274225000161650040003625001183628929;31240602274225000161650060002747181165600338;31240802274225000161650040003355351808952174;31240821560153000163650060000707221242875474',
        },
      })
      .then((response) => {
        console.log('Response', response);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  useEffect(() => {
    const getPrices = async () => {
      await axios
        .get(`/api/prices?nomeProduto=BOLACHA DE QUEIJO`)
        .then(async (response) => {
          setproduct(response.data.data[0]);
          await axios
            .get(`api/prices/history?idPreco=${response.data.data[0].id}`)
            .then((response) => {
              setChartData(response.data.data);
            })
            .catch((error) => {
              console.error(error.response);
            });
        })
        .catch((error) => {
          console.error(error.response);
        });
    };
    getPrices();
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box component="main" maxWidth="xl" marginX="auto" width="100%">
        <NavBar />
        <Grid
          container
          height={mdDownScreen ? 'auto' : '100dvh'}
          paddingTop={mdDownScreen ? 11 : 14}
        >
          <Grid
            display="flex"
            flexDirection="column"
            item
            justifyContent="center"
            md={7}
            paddingLeft={mdDownScreen ? 0 : 2}
            paddingTop={mdDownScreen ? 6 : 0}
            xs={12}
          >
            <Typography
              component="h1"
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
              width="100%"
            >
              <Button
                onClick={goToHome}
                size="large"
                variant="contained"
                sx={{
                  borderRadius: '50px',
                  fontSize: 14,
                  fontWeight: 600,
                  paddingX: 3,
                  paddingY: 2,
                }}
              >
                Conheça agora - É grátis
              </Button>
            </Stack>
          </Grid>
          <Grid
            alignItems="center"
            display="flex"
            item
            justifyContent="center"
            md={5}
            paddingLeft={0}
            paddingY={mdDownScreen ? 3 : 0}
            xs={12}
          >
            <Image
              alt="Carrinho de compras"
              height={sizeImage}
              src="/cart.png"
              width={sizeImage}
            />
          </Grid>
          <Grid
            display="flex"
            item
            justifyContent="center"
            paddingLeft={0}
            paddingY={mdDownScreen ? 3 : 0}
            xs={12}
          >
            <Typography color="primary.dark" textAlign="center" variant="h5">
              Compare preços de vários mercados em um só lugar e economize nas
              suas compras!
            </Typography>
          </Grid>
        </Grid>
        <Grid container marginBottom={4} paddingX={1} rowGap={3}>
          <Grid
            display="flex"
            flexDirection="column"
            rowGap={3}
            item
            justifyContent="center"
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
                width: sizeImage,
              }}
            />
            <Typography
              marginTop={mdDownScreen ? 2 : 0}
              variant={mdDownScreen ? 'h5' : 'h4'}
              textAlign="center"
            >
              Acompanhe a variação dos preços dos produtos de forma{' '}
              <strong>Fácil</strong> e <strong>Intuitiva</strong>.
            </Typography>
          </Grid>
          <Grid item paddingLeft={0} md={7} xs={12}>
            {chartData.length > 0 && (
              <Paper
                component={Box}
                display="flex"
                flexDirection="column"
                paddingX={3}
                paddingY={3}
                rowGap={3}
                width="100%"
              >
                <Typography
                  gutterBottom
                  textAlign="center"
                  width="100%"
                  variant="h6"
                >
                  Evolução do preço da <strong>{product?.nomeProduto}</strong>
                </Typography>
                <Typography
                  color="primary.dark"
                  textAlign="center"
                  width="100%"
                  variant="h6"
                >
                  {product?.nomeMercado}
                </Typography>
                <PriceHistoryChart height={300} prices={chartData} />
              </Paper>
            )}
          </Grid>
          <Grid item paddingLeft={0} xs={12}>
            <Paper
              component={Box}
              marginY={3}
              paddingX={3}
              paddingY={6}
              width="100%"
            >
              <Typography textAlign="center" variant="h5">
                Tenha acesso ao histórico de preços, controle seus gastos,
                compare valores em diferentes mercados e faça escolhas
                inteligentes para poupar dinheiro.
              </Typography>
            </Paper>
          </Grid>
          <Grid display="flex" item paddingLeft={0} position="relative" xs={12}>
            <img
              src="/market.jpg"
              alt="Corredor de mercado"
              loading="lazy"
              width="90%"
              style={{
                borderRadius: '10px',
                filter: 'blur(4px)',
                margin: 'auto',
              }}
            />
            <Fab
              color="primary"
              onClick={goToHome}
              variant="extended"
              sx={{
                fontSize: 14,
                fontWeight: 600,
                left: '25%',
                paddingX: 3,
                paddingY: 2,
                position: 'absolute',
                right: '25%',
                top: '50%',
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
}

const names = ['Banana Prata', 'Laranja kg', 'Leite cond pir 39'];

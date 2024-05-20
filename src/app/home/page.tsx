'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Avatar, Box, Button, Container, CssBaseline,
    Divider, IconButton, List, ListItem,
    ListItemAvatar, ListItemText, Link as MUILink, Stack, TextField, Typography,
} from '@mui/material';
import { Assignment, Clear, Fingerprint, QrCode } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import { addTaxReceipet, getPrices } from '@/shared/Server/Actions/actions';
import { Precos } from '@/shared/service/firebaseService';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import lottieLoading from '@/shared/assets/loading-2.json';
import { BRCurrencyFormat } from '@/shared/util';
import Footer from '@/shared/components/footer';

const URLs = [
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650060002663641256820902|2|1|1|e36cdc053b3b2922eb81e63e4cb09cd09271cc20'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651390000306311070547663|2|1|1|08C2604D2B0E01D3FF09FA64FFC912CC748E8EA2'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000955431663696391|2|1|1|00353286E1AEE9BB65C84DE432092258BF70C731'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650120001114521284740434|2|1|1|DE4DA9F317839064ECA4A9A32088B29BE785B738'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650050000801851159654559|2|1|1|20F18AF9BB929CD9914C234316947B9E44881EF1'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651370000382361689932910|2|1|1|2346EBEC1A1DDA94A3E0E80AA7938AA575CC2BC5'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003217001204755066|2|1|1|8268d27ac527d60de354e822d3847ca9fcff9003'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240525834847003541651400000379449794945270|2|1|07|22.30|72667348416f72526e686a6d544d6a6a4738394d4e3941715831513d|1|62C51E0EB0D6205A7D524A1013A044AE0319EAD8'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003219851173286530|2|1|1|c937ca6279518f6c5c3bc740057d0fbafdd3b69f'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000966041470583716|2|1|1|E96DF0CFCC91AE293E899ACFF9635668CF0C4195'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000967941046630543|2|1|1|853946743B3D264F5E13D86221D8D7A9F300568F'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650040003235861149757654|2|1|1|d1ca47d639972e28bf31aafb6b44aa1948a25d48'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240502274225000161650050002323961314056040|2|1|1|c15787504709afc38186411d90e9c315316f3629'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000983061066016896|2|1|1|7E59E1356AE8B34F443147CC757EA3AE7697A24B'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240521560153000163650060000582621605814762|2|1|1|53664AD48423AF39DE4194F05FB276C29241BC26'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650170001244411356947809|2|1|1|127E688BDF4DE5FC0BBDD3A35E5D5087A58BBFB1'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001028831133159854|2|1|1|9770CECA91303C7A350860AE5ED15386163E268E'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240421560153000163650040001367649023640840|2|1|20|42.19|7047326F753335396D342B66684D663157546369453679664C64633D|1|EC3D7C78FA5A70F6CE73EBCCC676B3BA185DC416'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650060002641121203294580|2|1|1|1db0595783faa2997d7535cdfb49ffb681a50dda'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240421560153000163650040001367649023640840|2|1|20|42.19|7047326F753335396D342B66684D663157546369453679664C64633D|1|EC3D7C78FA5A70F6CE73EBCCC676B3BA185DC416'
    },
    {
        'url': 'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240403111258000153650140001043801889016202|2|1|1|5918C21E87DC2BD385AE1013A751146C712B2379'
    }
]

export default function Home() {
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<null | Precos[]>(null);
    const [pricesConst, setPricesConst] = useState<null | Precos[]>(null);
    const [loading, setLoading] = useState(false);

    const handleClick = async (code: string) => {
        if (loading) {
            alert('Aguarde e tente mais tarde...');
            return;
        }
        setPrices(null);
        setPricesConst(null);
        setLoading(true);
        const response = await addTaxReceipet(code)
        if (response.status == 200) {
            alert('Obrigado pelo envio da sua NF. Em breve os preços atualizados aparecerão abaixo.');
        } else {
            alert('Houve um erro ao enviar a NF: ' + response.message);
        }
        setLoading(false);
    };

    const updatePrices = async () => {
        if (loading) return;
        setLoading(true);
        const listPrices = await getPrices();
        if (listPrices === null)
            alert('Erro ao tentar atualizar dados. Tente mais tarde.');
        setPrices(listPrices);
        setPricesConst(listPrices);
        setLoading(false);
    }

    const handleFilter = (value: string) => {
        if (pricesConst === null || loading) return
        setPrices(pricesConst?.filter((price) => (price.mercado.toLowerCase().includes(value.toLowerCase()) || price.produto.toLowerCase().includes(value.toLowerCase()))) as Precos[]);
        setLoading(false);
    }

    const clearFilter = () => {
        setPrices(pricesConst);
    }

    useEffect(() => console.log('Renderizou'), []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <CssBaseline />
            <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='lg'>
                <Typography variant='h4' gutterBottom>
                    Bem vindo(a) ao nosso sistema ainda sem nome!
                </Typography>
                <Typography variant='h5' gutterBottom>
                    Acompanhe o preço dos produtos de mercado com informações reais e atualizadas.
                </Typography>
                <Typography variant='h5' gutterBottom>
                    Se você está com aquela notinha do mercado em mãos, baste ler o QRCode dela para atualizarmos nossos preços.
                </Typography>
                <Typography variant='subtitle1'>Em breve melhoraremos nosso layout.</Typography>
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    paddingY={5}
                    gap={3}
                >
                    <Button endIcon={<QrCode />} onClick={() => setOpenQR(true)} variant='contained'>Escanear</Button>
                    {/*<Button endIcon={<QrCode />} onClick={() => handleClick('https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650040003195201165010981|2|1|1|641c767ef4f193bcb2a1e919210842158f832e80')} variant='contained'>Escanear</Button>
                    <Button endIcon={<QrCode />} onClick={() => handleClick(URLs[0].url)} variant='contained'>Escanear</Button>*/}
                    <Button endIcon={<QrCode />} onClick={updatePrices} variant='contained'>Atualizar Lista</Button>
                    <Stack width='100%' direction='row'>
                        <TextField fullWidth label='Filtrar esta lista...' id='fullWidth' onChange={(e) => handleFilter(e.target.value)} />
                        <IconButton aria-label='Clear' color='secondary' onClick={clearFilter} sx={{marginX: 1}}>
                            <Clear />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
            <ModalQrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => handleClick(code)}
                openQr={openQR}
            />
            {
                loading && (
                    <Player
                        autoplay
                        keepLastFrame
                        loop
                        src={lottieLoading}
                        style={{
                            height: 200,
                            width: 200
                        }}
                    />
                )}
            <Box width='100%'>
                {
                    (prices !== null && Array.isArray(prices) && prices.length > 0) && (
                        <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                            {
                                prices?.map((price, index) => (
                                    <>
                                        <ListItem alignItems='flex-start' key={price.id}>
                                            <ListItemAvatar color='primary'>
                                                <Avatar>
                                                    <Assignment />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${price.produto} (${price.unidadeMedida})`}
                                                secondary={
                                                    <>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component='span'
                                                            variant='body2'
                                                            color='text.primary'
                                                        >
                                                            {price.data}
                                                        </Typography>
                                                        {` — ${BRCurrencyFormat(price.valor)} no ${price.mercado}`}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {
                                            index < prices.length - 1 && <Divider variant='inset' component='li' />
                                        }
                                    </>
                                ))
                            }
                        </List>
                    )
                }
            </Box>
            <Footer />
        </Box>
    )
}
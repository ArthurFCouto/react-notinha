'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, CssBaseline, Link as MUILink, Typography } from '@mui/material';
import { createPrices } from '@/app/actions';
import ModalQrReader from '@/components/home/ModalQrReader';
import { QrCode } from '@mui/icons-material';

export default function Home() {
    const [openQR, setOpenQR] = useState(false);
    const [market, setMarket] = useState<any>(null);
    const [prices, setPrices] = useState<any>(null);
    const [nf, setNF] = useState<any>(null);

    const handleClick = async (code: string) => {
        setMarket(null);
        setPrices(null);
        setNF(null);
        const response = await createPrices(code)
        if (response.status == 200) {
            setMarket(response.data?.mercado);
            setPrices(response.data.precos);
            setNF(response.data.NF)
            console.log('Data', {
                market,
                prices,
                nf
            });
        } else {
            console.log('Erro no processamento', response.data);
        }
    };

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
                    E se você está com aquela notinha do mercado em mãos, baste ler o QRCode dela para atualizarmos nossos preços.
                </Typography>
                <Typography variant='subtitle1'>Em breve melhoraremos nosso layout.</Typography>
                <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    paddingY={5}
                >
                    <Button endIcon={<QrCode />} onClick={() => setOpenQR(true)} variant='contained'>Escanear</Button>
                    {/*<Button endIcon={<QrCode />} onClick={() => handleClick('https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650040003195201165010981|2|1|1|641c767ef4f193bcb2a1e919210842158f832e80')} variant='contained'>Escanear</Button>*/}
                </Box>
            </Container>
            <ModalQrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => handleClick(code)}
                openQr={openQR}
            />
            <Box display='flex' flexDirection='column' gap={2}>
                {
                    market != null && (
                        <Card sx={{ marginX: 'auto', maxWidth: 500 }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="https://source.unsplash.com/800x600/?mercado"
                                    alt={`${market.razaoSocial} ${market.CNPJ}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {market.nomeFantasia}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {`${market.endereco} ${market.numero}, ${market.bairro} - ${market.cidade}/${market.UF} ${market.CEP}`}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                }
                {
                    (prices != null && Array.isArray(prices)) && (
                        <>
                            {
                                prices.map((price, index) => (
                                    <Card key={index} sx={{ marginX: 'auto', maxWidth: 500 }}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {price.nome}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {`Tipo de medida: ${price.unidadeMedida}, preço por ${price.unidadeMedida}: R$ ${price.valor}`}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                ))
                            }
                        </>
                    )
                }
            </Box>
            <Box
                component='footer'
                sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            >
                <Container maxWidth='xl'>
                    <Copyright />
                </Container>
            </Box>
        </Box>
    )
}

function Copyright() {
    return (
        <Typography variant='body2' color='text.secondary'>
            {'Copyright © '}
            <MUILink component={Link} color='inherit' href='https://instagram.com/arthurfcouto'>
                ArthurFCouto
            </MUILink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Accordion,
    AccordionDetails,
    AccordionSlots,
    AccordionSummary,
    Box, Button, Container, CssBaseline,
    Fade,
    LinearProgress,
    Link as MUILink, Typography
} from '@mui/material';
import { addTaxReceipet, getPrices } from '@/app/actions';
import ModalQrReader from '@/components/home/ModalQrReader';
import { ExpandMore, QrCode } from '@mui/icons-material';
import { Precos } from '@/service/firebaseService';

export default function Home() {
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<null | Precos[]>(null);
    const [loading, setLoading] = useState(true);
    const [pricesExpanded, setPricesExpanded] = useState(false);

    const handleExpansion = () => {
        setPricesExpanded((prevExpanded) => !prevExpanded);
    };

    const handleClick = async (code: string) => {
        if (loading) {
            alert('Aguarde e tente mais tarde...');
            return;
        }
        setLoading(true);
        const response = await addTaxReceipet(code)
        if (response.status == 200) {
            alert('Obrigado pelo envio da sua NF. Em breve os preços atualizados aparecerão abaixo.');
        } else {
            alert('Houve um erro ao enviar a NF: ' + response.message);
            console.log('Erro no processamento', response.data);
        }
        setLoading(false);
    };

    const updatePrices = async () => {
        if (loading) return;
        setLoading(true);
        const listPrices = await getPrices();
        if (listPrices === null)
            alert('Erro ao tentar atualizar dados. Tente mais tarde.');
        else {
            listPrices.sort((prev, next) => {
                if (prev.produto < next.produto) return -1;
                if (prev.produto > next.produto) return 1;
                return 0;
            });
            listPrices.sort((prev, next) => {
                const dataA = new Date(prev.data).getTime();
                const dataB = new Date(next.data).getTime();
                return dataA - dataB;
            });
        }
        setPrices(listPrices);
        setLoading(false);
    }

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
                    {/*<Button endIcon={<QrCode />} onClick={() => handleClick('https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240402274225000161650040003195201165010981|2|1|1|641c767ef4f193bcb2a1e919210842158f832e80')} variant='contained'>Escanear</Button>*/}
                    <Button endIcon={<QrCode />} onClick={updatePrices} variant='contained'>Atualizar Lista</Button>
                </Box>
            </Container>
            <ModalQrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => handleClick(code)}
                openQr={openQR}
            />
            {loading && <LinearProgress color='inherit' />}
            <Box width='100%'>
                {
                    (prices != null && Array.isArray(prices)) && (
                        <>
                            {
                                prices?.map((price) => (
                                    <Accordion
                                        key={price.id}
                                        expanded={pricesExpanded}
                                        onChange={handleExpansion}
                                        slots={{ transition: Fade as AccordionSlots['transition'] }}
                                        slotProps={{ transition: { timeout: 400 } }}
                                        sx={{
                                            '& .MuiAccordion-region': { height: pricesExpanded ? 'auto' : 0 },
                                            '& .MuiAccordionDetails-root': { display: pricesExpanded ? 'block' : 'none' },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMore />}
                                            aria-controls="panel1-content"
                                            id="panel1-header"
                                        >
                                            <Typography>{price.produto}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                {`Tipo de medida: ${price.unidadeMedida}, preço por ${price.unidadeMedida}: R$ ${price.valor}. Mercado: ${price.mercado}. Data: ${price.data}`}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
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
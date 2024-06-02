'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import {
    Alert, Avatar, Box, Button, CircularProgress,
    Container, Divider, Fab, IconButton, InputBase,
    List, ListItem, ListItemAvatar, ListItemText, Paper,
    Skeleton, Snackbar, Stack, Typography
} from '@mui/material';
import {
    Assignment, Clear, FilterList,
    North, QrCode, Refresh, Timeline
} from '@mui/icons-material';
import { Precos } from '@/shared/service/firebase';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import { BRCurrencyFormat } from '@/shared/util';
import Footer from '@/shared/components/footer';
import { FilterListPrices, HandleStateAlert, SendUrl, UpdateListPrices } from './functions';
import ModalPriceHistory from '@/shared/components/home/ModalPriceHistory';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [sendingUrl, setSendingUrl] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<Precos[]>([]);
    const [originalPrices, setOriginalPrices] = useState<Precos[]>([]);
    const [showButtonToTop, setShowButtonToTop] = useState(false);
    const [showPriceHistory, setShowPriceHistory] = useState(false);
    const [queryPriceHistory, setQueryPriceHistory] = useState('');
    const filterRef = useRef<HTMLInputElement>(null);
    const [stateAlert, dispatchAlert] = useReducer(HandleStateAlert, {
        message: '',
        severity: 'success',
        open: false
    });

    const CustomAlert = () => (
        <Snackbar
            open={stateAlert.open}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            autoHideDuration={5000}
            onClose={() => dispatchAlert({ type: 'close' })}>
            <Alert
                onClose={() => dispatchAlert({ type: 'close' })}
                severity={stateAlert.severity}
                variant='filled'
                sx={{ width: '100%' }}
            >
                {stateAlert.message}
            </Alert>
        </Snackbar>
    )

    const LoadingSkeleton = () => (
        <ListItem alignItems='flex-start'>
            <ListItemAvatar color='primary'>
                <Skeleton
                    variant='circular'
                    width={40}
                    height={40}
                    animation='wave'
                />
            </ListItemAvatar>
            <ListItemText
                primary={<Skeleton variant='text' sx={{ fontSize: '1rem' }} animation='wave' />}
                secondary={<Skeleton variant='rectangular' animation='wave' />}
            />
        </ListItem>
    )

    const clearFilter = () => {
        setPrices(originalPrices);
        if (filterRef.current !== null)
            filterRef.current.value = '';
    }

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        const handleShowToTopButton = () => {
            window.scrollY > window.innerHeight / 2 ? setShowButtonToTop(true) : setShowButtonToTop(false);
        }
        window.addEventListener('scroll', handleShowToTopButton);

        UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert);

        return () => {
            window.addEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    return (
        <Box
            display='flex'
            flexDirection='column'
            height='100%'
        >
            <Container component='main' sx={{ mt: 8, mb: 2 }} maxWidth='lg'>
                <Typography variant='h4' gutterBottom>
                    Bem vindo(a) ao nosso sistema ainda sem nome!
                </Typography>
                <Typography variant='h5' gutterBottom>
                    Acompanhe o preço dos produtos de mercado com informações reais e atualizadas.
                </Typography>
                <Typography variant='body1' gutterBottom>
                    Se tem em mãos um cupom fiscal de mercado, baste ler o QRCode dela para atualizarmos nossos preços.
                </Typography>
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    paddingY={5}
                    gap={3}
                >
                    <Stack direction='row' gap={2}>
                        <Button endIcon={sendingUrl ? <CircularProgress color='inherit' size={20} /> : <QrCode />} onClick={() => setOpenQR(true)} variant='outlined'>Escanear</Button>
                        <Button endIcon={loading ? <CircularProgress color='inherit' size={20} /> : <Refresh />} onClick={() => UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert)} variant='contained'>Listar Itens</Button>
                        {/*<Button endIcon={sendingUrl ? <CircularProgress color='inherit' size={20} /> : <Refresh />} onClick={() => SendUrl('https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240503111258000153650160000955431663696391|2|1|1|00353286E1AEE9BB65C84DE432092258BF70C731', sendingUrl, setSendingUrl, dispatchAlert)} variant='contained'>Teste</Button>*/}
                    </Stack>
                </Box>
                <Paper
                    alignItems='center'
                    component={Box}
                    display='flex'
                    marginBottom={0.5}
                    paddingX={0.5}
                    paddingY={1}
                    width='100%'
                >
                    <FilterList sx={{ margin: 1 }} />
                    <InputBase
                        inputRef={filterRef}
                        onChange={(e) => FilterListPrices(loading, originalPrices, setPrices, e.target.value)}
                        placeholder='Filtrar esta lista'
                        sx={{ flex: 1 }}
                    />
                    <Divider sx={{ height: '30px' }} orientation='vertical' />
                    <IconButton
                        color='primary'
                        onClick={clearFilter}
                    >
                        <Clear />
                    </IconButton>
                </Paper>
                {
                    loading && (
                        <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => <LoadingSkeleton key={item} />)}
                        </List>
                    )
                }
                {
                    (prices.length > 0 && !loading) && (
                        <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
                            {
                                prices.map((price, index) => (
                                    <div key={price.id}>
                                        <ListItem alignItems='flex-start'>
                                            <ListItemAvatar color='primary'>
                                                <Avatar>
                                                    <Assignment />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemAvatar color='success'>
                                                <Avatar
                                                    onClick={() => {
                                                        setQueryPriceHistory(price.produto);
                                                        setShowPriceHistory(true);
                                                    }}
                                                >
                                                    <Timeline />
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
                                                        {` — ${BRCurrencyFormat(parseFloat(price.valor))} no ${price.mercado}`}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                        {
                                            index < prices.length - 1 && <Divider variant='inset' component='li' />
                                        }
                                    </div>
                                ))
                            }
                        </List>
                    )
                }
            </Container>
            <ModalQrReader
                closeQr={() => setOpenQR(false)}
                getCode={(code) => SendUrl(code, sendingUrl, setSendingUrl, dispatchAlert)}
                openQr={openQR}
            />
            {
                showButtonToTop && (
                    <Fab
                        color='primary'
                        sx={{
                            position: 'fixed',
                            bottom: 15,
                            right: 15
                        }}
                        onClick={goToTop}
                    >
                        <North />
                    </Fab>
                )
            }
            <ModalPriceHistory
                open={showPriceHistory}
                close={() => setShowPriceHistory(false)}
                onError={(message) => { dispatchAlert({ type: 'open', message: message, severity: 'error' }) }}
                query={queryPriceHistory}
            />
            <CustomAlert />
            <Footer />
        </Box>
    )
}
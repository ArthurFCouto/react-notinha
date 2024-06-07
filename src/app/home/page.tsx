'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import {
    Alert, Box, Button, CircularProgress,
    Divider, Fab, IconButton, InputBase,
    Paper, Snackbar, Stack, Typography
} from '@mui/material';
import {
    Clear, FilterList,
    HistoryEdu, North, QrCode, Refresh
} from '@mui/icons-material';
import { Price } from '@/shared/service/firebase';
import Footer from '@/shared/components/footer';
import { FilterListPrices, HandleStateAlert, SendUrl, UpdateListPrices } from './functions';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import ModalPriceHistory from '@/shared/components/home/ModalPriceHistory';
import CardItems, { CardItemsLoading } from '@/shared/components/home/CardItems';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [sendingUrl, setSendingUrl] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<Price[]>([]);
    const [originalPrices, setOriginalPrices] = useState<Price[]>([]);
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

    const clearFilter = () => {
        setPrices(originalPrices);
        if (filterRef.current !== null)
            filterRef.current.value = '';
    }

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleHistory = (query: string) => {
        setQueryPriceHistory(query);
        setShowPriceHistory(true);
    }

    useEffect(() => {
        const handleShowToTopButton = () => {
            window.scrollY > window.innerHeight / 2 ? setShowButtonToTop(true) : setShowButtonToTop(false);
        }
        window.addEventListener('scroll', handleShowToTopButton);

        //UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert);

        clearFilter();

        return () => {
            window.addEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    return (
        <Box
            alignItems='center'
            display='flex'
            flexDirection='column'
            height='100%'
        >
            <Box
                component='main'
                padding={1}
                maxWidth='lg'
            >
                <Typography
                    variant='h4'
                    gutterBottom
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'start'
                    }}
                >
                    Notinha
                    <HistoryEdu fontSize='inherit' />
                </Typography>
                <Typography variant='h5' gutterBottom>
                    Acompanhe o preço dos produtos de mercado com informações reais e atualizadas.
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
                        {/*<Button endIcon={sendingUrl ? <CircularProgress color='inherit' size={20} /> : <QrCode />} onClick={() => SendUrl('https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=31240602274225000161650040003274431807746699|2|1|1|b8c056a83232d3b5eae81417e191275d3473f9a1', sendingUrl, setSendingUrl, dispatchAlert)} variant='outlined'>Teste</Button> */}
                        <Button endIcon={loading ? <CircularProgress color='inherit' size={20} /> : <Refresh />} onClick={() => UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert)} variant='contained'>Listar Itens</Button>
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
                        disabled={originalPrices.length === 0 ? true : false}
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
                        <CardItemsLoading amount={10} />
                    )
                }
                {
                    (prices.length > 0 && !loading) && (
                        <CardItems items={prices} clickOnHistory={handleHistory} />
                    )
                }
            </Box>
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
            <ModalQrReader
                close={() => setOpenQR(false)}
                getCode={(code) => SendUrl(code, sendingUrl, setSendingUrl, dispatchAlert)}
                onError={(message) => { dispatchAlert({ type: 'open', message: message, severity: 'error' }) }}
                open={openQR}
            />
            <ModalPriceHistory
                close={() => setShowPriceHistory(false)}
                onError={(message) => { dispatchAlert({ type: 'open', message: message, severity: 'error' }) }}
                open={showPriceHistory}
                query={queryPriceHistory}
            />
            <CustomAlert />
            <Footer />
        </Box>
    )
}
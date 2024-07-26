'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import {
    Alert, Box, CircularProgress,
    Divider, Fab, Fade, IconButton, InputBase,
    Paper, Snackbar, useMediaQuery, useTheme
} from '@mui/material';
import {
    Clear, CloudUpload,
    KeyboardArrowUp,
    Refresh
} from '@mui/icons-material';
import { Price } from '@/shared/service/firebase';
import Footer from '@/shared/components/root/footer';
import { FilterListPrices, HandleStateAlert, SendUrl, UpdateListPrices } from './functions';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import ModalPriceHistory from '@/shared/components/home/ModalPriceHistory';
import CardItems, { CardItemsLoading } from '@/shared/components/home/CardItems';
import NavBar from '@/shared/components/root/NavBar';

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
    const theme = useTheme();
    const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));

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
            window.scrollY > window.innerHeight / 1.5 ? setShowButtonToTop(true) : setShowButtonToTop(false);
        }
        window.addEventListener('scroll', handleShowToTopButton);

        clearFilter();

        //UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert);

        return () => {
            window.removeEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    return (
        <Box
            display='flex'
            flexDirection='column'
            height='100%'
        >
            <Box
                component='main'
                padding={1}
                maxWidth='xl'
                marginX='auto'
                width='100%'
            >
                <NavBar />
                <Paper
                    alignItems='center'
                    component={Box}
                    display='flex'
                    marginBottom={2.5}
                    marginTop={theme.spacing(12)}
                    paddingX={0.5}
                    paddingY={1}
                    width='100%'
                >
                    <IconButton
                        color='secondary'
                        onClick={() => setOpenQR(true)}
                    >
                        {sendingUrl ? <CircularProgress color='inherit' size={20} /> : <CloudUpload />}
                    </IconButton>
                    <InputBase
                        inputRef={filterRef}
                        onChange={(e) => FilterListPrices(loading, originalPrices, setPrices, e.target.value)}
                        placeholder='Produto, data ou mercado...'
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
                    <IconButton
                        color='primary'
                        onClick={() => UpdateListPrices(loading, setLoading, setPrices, setOriginalPrices, dispatchAlert)}
                    >
                        {loading ? <CircularProgress color='inherit' size={20} /> : <Refresh />}
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
            <Fade in={showButtonToTop}>
                <Fab
                    color='primary'
                    sx={{
                        position: 'fixed',
                        bottom: 15,
                        right: 15
                    }}
                    onClick={goToTop}
                >
                    <KeyboardArrowUp />
                </Fab>
            </Fade>
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
};
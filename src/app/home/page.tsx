'use client';

import { useEffect, useMemo, useReducer, useRef, useState, useTransition } from 'react';
import {
    Alert, Box, CircularProgress,
    Divider, IconButton, InputBase,
    Paper, Snackbar, useMediaQuery, useTheme
} from '@mui/material';
import {
    Clear, CloudUpload,
    Refresh
} from '@mui/icons-material';
import { Price } from '@/shared/service/firebase';
import Footer from '@/shared/components/root/footer';
import { HandleStateAlert, SendUrl, UpdateListPrices } from './functions';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import ModalPriceHistory from '@/shared/components/home/ModalPriceHistory';
import CardItems, { CardItemsLoading } from '@/shared/components/home/CardItems';
import NavBar from '@/shared/components/root/NavBar';
import ButtonGoToTop from '@/shared/components/root/ButtonGoToTop';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [sendingUrl, setSendingUrl] = useState(false);
    const [openQR, setOpenQR] = useState(false);
    const [originalPrices, setOriginalPrices] = useState<Price[]>([]);
    const [showPriceHistory, setShowPriceHistory] = useState(false);
    const [queryPriceHistory, setQueryPriceHistory] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const filterRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();
    const mdDownScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [stateAlert, dispatchAlert] = useReducer(HandleStateAlert, {
        message: '',
        severity: 'success',
        open: false
    });

    const prices = useMemo(() => {
        if (searchInput.trim().length === 0)
            return originalPrices;
        return originalPrices.filter((price) => (price.mercado.toLowerCase().includes(searchInput.toLowerCase()) || price.produto.toLowerCase().includes(searchInput.toLowerCase()) || price.data.toLowerCase().includes(searchInput.toLowerCase())));
    }, [originalPrices, searchInput])

    const clearFilter = () => {
        startTransition(() => {
            setSearchInput('');
        });
        if (filterRef.current !== null)
            filterRef.current.value = '';
    }

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

    const handleHistory = (query: string) => {
        setQueryPriceHistory(query);
        setShowPriceHistory(true);
    }

    useEffect(() => {
        clearFilter();
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
                        onChange={(e) => {
                            startTransition(() => {
                                setSearchInput(e.target.value);
                            })
                        }}
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
                        onClick={() => UpdateListPrices(loading, setLoading, setOriginalPrices, dispatchAlert)}
                    >
                        {loading ? <CircularProgress color='inherit' size={20} /> : <Refresh />}
                    </IconButton>
                </Paper>
                {
                    (loading || isPending) && (
                        <CardItemsLoading amount={10} />
                    )
                }
                {
                    (prices.length > 0 && !loading) && (
                        <CardItems items={prices} clickOnHistory={handleHistory} />
                    )
                }
            </Box>
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
            <ButtonGoToTop />
            <CustomAlert />
            <Footer />
        </Box>
    )
};
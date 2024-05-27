'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import {
    Alert,
    Avatar, Box, Button, Container,
    Divider, Fab, IconButton, InputBase, List, ListItem,
    ListItemAvatar, ListItemText, Paper, Snackbar, Stack, Typography,
} from '@mui/material';
import {
    Assignment, Clear, FilterList,
    North, QrCode, Refresh
} from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import { addTaxReceipet, getPrices } from '@/shared/Server/Actions/actions';
import { Precos } from '@/shared/service/firebase';
import ModalQrReader from '@/shared/components/home/ModalQrReader';
import lottieLoading from '@/shared/assets/loading-2.json';
import { BRCurrencyFormat } from '@/shared/util';
import Footer from '@/shared/components/footer';

type Close = { type: 'close' };
type Open = {
    type: 'open';
    message: string;
    severity: 'success' | 'error'
};
type AlertActions = Close | Open;
interface AlertState {
    message: string,
    severity: 'success' | 'error',
    open: boolean
}

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [lottieRef, setLottieRef] = useState<any>(null);
    const [openQR, setOpenQR] = useState(false);
    const [prices, setPrices] = useState<Precos[]>([]);
    const [pricesConst, setPricesConst] = useState<Precos[]>([]);
    const [showToTopButton, setShowToTopButton] = useState(false);
    const filterRef = useRef<HTMLInputElement>(null);

    const alertReducer = (state: AlertState, action: AlertActions) => {
        switch (action.type) {
            case 'close':
                return { ...state, open: false };
            case 'open':
                return { ...state, message: action.message, open: true, severity: action.severity }
            default:
                return state;
        }
    }
    const [stateAlert, dispatchAlert] = useReducer(alertReducer, {
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

    const sendUrl = async (url: string) => {
        if (loading) {
            dispatchAlert({ type: 'open', message: 'Aguarde e tente mais tarde.', severity: 'error' });
            return;
        }
        setLoading(true);
        await addTaxReceipet(url)
            .then(() => {
                dispatchAlert({ type: 'open', message: 'Obrigado pelo seu envio. Atualize a lista de preços.', severity: 'success' });
            })
            .catch((error) => {
                dispatchAlert({ type: 'open', message: error.message, severity: 'error' });
            })
        setLoading(false);
    };

    const updatePrices = async () => {
        if (loading) return;
        setLoading(true);
        setPrices([]);
        setPricesConst([]);
        await getPrices()
            .then((precos) => {
                if (precos.length === 0)
                    dispatchAlert({ type: 'open', message: 'Não há preços cadastrados no momento.', severity: 'error' });
                else {
                    setPrices(removeRepeated(precos));
                    setPricesConst(removeRepeated(precos));
                }
            })
            .catch((error) => {
                dispatchAlert({ type: 'open', message: error.message, severity: 'error' });
            });
        setLoading(false);
    }

    const removeRepeated = (originalList: Precos[]): Precos[] => {
        if (originalList.length === 0)
            return originalList;
        const map: {
            [key: string]: Precos
        } = {};

        originalList.forEach(preco => {
            const { produto, data, mercado } = preco;
            const key = produto + '_' + mercado;
            if (map[key]) {
                if (new Date(data) > new Date(map[key].data)) {
                    map[key] = preco;
                }
            } else {
                map[key] = preco;
            }
        });
        return Object.values(map);
    }

    const filterList = (value: string) => {
        if (pricesConst.length === 0 || loading) return
        setPrices(pricesConst.filter((price) => (price.mercado.toLowerCase().includes(value.toLowerCase()) || price.produto.toLowerCase().includes(value.toLowerCase()) || price.data.toLowerCase().includes(value.toLowerCase()))));
        setLoading(false);
    }

    const clearFilter = () => {
        setPrices(pricesConst);
        if (filterRef.current !== null)
            filterRef.current.value = '';
    }

    const goToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        const handleShowToTopButton = () => {
            window.scrollY > window.innerHeight / 2 ? setShowToTopButton(true) : setShowToTopButton(false);
        }
        window.addEventListener('scroll', handleShowToTopButton);

        return () => {
            window.addEventListener('scroll', handleShowToTopButton);
        }
    }, []);

    useEffect(() => {
        if (lottieRef !== null) {
            if (loading)
                lottieRef.play();
            else
                lottieRef.stop();

        }
    }, [loading]);

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
                        <Button endIcon={<QrCode />} onClick={() => setOpenQR(true)} variant='outlined'>Escanear</Button>
                        <Button endIcon={<Refresh />} onClick={updatePrices} variant='contained'>Listar Itens</Button>
                    </Stack>
                </Box>
                <Player
                    lottieRef={(ref) => { setLottieRef(ref) }}
                    keepLastFrame
                    loop
                    src={lottieLoading}
                    style={{
                        height: 100
                    }}
                />
                <Paper
                    alignItems='center'
                    component={Box}
                    display='flex'
                    marginBottom={0.5}
                    paddingX={0.5}
                    paddingY={1}
                    width='100%'
                >
                    <IconButton>
                        <FilterList />
                    </IconButton>
                    <InputBase
                        inputRef={filterRef}
                        onChange={(e) => filterList(e.target.value)}
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
                getCode={(code) => sendUrl(code)}
                openQr={openQR}
            />
            {
                showToTopButton && (
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
            <CustomAlert />
            <Footer />
        </Box>
    )
}
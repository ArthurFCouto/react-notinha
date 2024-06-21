'use client';

import { useEffect, useState } from 'react';
import {
    Box, Button, CircularProgress, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Stack, Typography
} from '@mui/material'
import { Player } from '@lottiefiles/react-lottie-player';
import { History } from '@mui/icons-material';
import { Price } from '@/shared/service/firebase';
import lottieLoading from '@/shared/assets/loading-2.json';
import PriceHistoryChart from '../PriceHistoryChart';
import { UpdateChart } from './functions';

interface ModalPriceHistoryProps {
    close: () => void,
    onError: (message: string) => void,
    open: boolean,
    query: string
}

export default function ModalPriceHistory({ close, open, onError, query }: ModalPriceHistoryProps) {
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [variation, setVariation] = useState(0);

    useEffect(() => {
        setLoading(true);
        UpdateChart(onError, query, setLoading, setPrices, setVariation);
    }, [query]);

    return (
        <Dialog
            fullWidth
            onClose={close}
            open={open}
            scroll='paper'
        >
            <DialogTitle>
                <Stack alignItems='center' direction='row' gap={1}>
                    Histórico de Preços <History color='primary' />
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Preços registrados para <strong>{query}</strong>.
                </Typography>
                <Box
                    display='flex'
                    justifyContent='center'
                    paddingY={2}
                >
                    {
                        loading ?
                            <Player
                                autoplay
                                keepLastFrame
                                loop
                                src={lottieLoading}
                                style={{
                                    height: 150,
                                    width: 150
                                }}
                            />
                            :
                            <PriceHistoryChart height={300} prices={prices} />
                    }
                </Box>
                {
                    prices.length > 0 && (
                        <Typography color='primary' textAlign='center' width='100%' variant='h6'>{prices[0].mercado}</Typography>
                    )
                }
                <DialogContentText >
                    Desde o primeiro registro, variação de <strong style={{ color: variation < 0 || variation === 0 ? 'green' : 'red' }}>{loading ? <CircularProgress color='inherit' size={17} /> : `${variation}%`}</strong>.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} size='small' variant='contained'>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog >
    );
};
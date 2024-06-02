'use client';

import { useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Typography } from '@mui/material'
import { Precos } from '@/shared/service/firebase';
import lottieLoading from '@/shared/assets/loading-2.json';
import { Player } from '@lottiefiles/react-lottie-player';
import PriceHistoryChart from '../PriceHistoryChart';
import { UpdateChart } from './functions';

interface ModalPriceHistoryProps {
    close: () => void,
    onError: (message: string) => void,
    open: boolean,
    query: string
}

export default function ModalPriceHistory({ close, open, onError, query }: ModalPriceHistoryProps) {
    const [prices, setPrices] = useState<Precos[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        UpdateChart(query, setPrices, setLoading, onError);
    }, [query]);

    return (
        <Dialog
            onClose={close}
            open={open}
            scroll='paper'
            fullWidth
        >
            <DialogTitle>
                Histórico de Preços
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Preços registrados para <strong>{query}</strong>.
                </Typography>
                <DialogContentText>
                    Variação de x.xx% desde o primeiro registro.
                </DialogContentText>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={close} variant='contained'>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog >
    )
}
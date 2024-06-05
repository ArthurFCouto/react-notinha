'use client';

import { useEffect, useState } from 'react';
import {
    Box, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Stack, Typography
} from '@mui/material'
import { Player } from '@lottiefiles/react-lottie-player';
import { Timeline } from '@mui/icons-material';
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
                    Histórico de Preços <Timeline />
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
                <DialogContentText>
                    Variação de {variation}% desde o primeiro registro.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} variant='contained'>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog >
    )
}
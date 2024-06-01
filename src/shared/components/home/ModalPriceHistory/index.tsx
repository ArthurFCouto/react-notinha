'use client';

import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { Close } from '@mui/icons-material'
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
        UpdateChart(query, setPrices, setLoading, onError);
    }, []);

    return (
        <Dialog
            onClose={close}
            open={open}
        >
            <DialogTitle>
                {`HISTÓRICO DE ${query}`}
            </DialogTitle>
            <IconButton
                onClick={close}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    //color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
            <DialogContent dividers>
                {
                    loading ? (
                        <Player
                            autoplay
                            keepLastFrame
                            loop
                            src={lottieLoading}
                            style={{
                                height: 300
                            }}
                        />
                    ) : (
                        <PriceHistoryChart prices={prices} />
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={close} variant='contained'>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog >
    )
}
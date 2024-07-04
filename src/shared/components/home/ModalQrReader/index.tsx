'use client';

import {
    Dialog, DialogContent, DialogTitle,
    IconButton, Stack, Typography
} from '@mui/material';
import { Close, QrCodeScanner } from '@mui/icons-material';
import QrReader from '../QrReader';

interface ModalQrReaderProps {
    close: () => void,
    getCode: (url: string) => void,
    onError: (message: string) => void
    open: boolean,
}

export default function ModalQrReader({ close, getCode, onError, open }: ModalQrReaderProps) {
    const handleGetCode = (code: string) => {
        getCode(code);
        close();
    }

    const handleError = (message: string) => {
        onError(message);
        close();
    }

    return (
        <Dialog
            fullWidth
            onClose={close}
            open={open}
        >
            <DialogTitle>
                <Stack alignItems='center' direction='row' gap={1}>
                    Centralize o QR Code <QrCodeScanner />
                    <IconButton color='primary' onClick={close} size='large' sx={{ marginLeft: 'auto', marginRight: '-12px' }}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <Typography>
                    Envie seu cupom fiscal escaneando seu QR Code.
                </Typography>
                <QrReader getCode={handleGetCode} onError={handleError} openCamera={open} />
            </DialogContent>
        </Dialog>
    );
};
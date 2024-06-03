'use client';

import {
    Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Stack
} from '@mui/material';
import { QrCodeScanner } from '@mui/icons-material';
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
            scroll='paper'
        >
            <DialogTitle>
                <Stack alignItems='center' direction='row' gap={1}>
                    Leitor de QR Code <QrCodeScanner />
                </Stack>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    Escaneie o QR Code do cupom fiscal recebido no mercado.
                </DialogContentText>
                <QrReader getCode={handleGetCode} onError={handleError} openCamera={open}/>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={close} variant='contained'>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
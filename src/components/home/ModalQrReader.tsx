/* https://medium.com/readytowork-org/implementing-a-qr-code-scanner-in-react-4c8f4e3c6f2e
   https://www.npmjs.com/package/qr-scanner */

import { useEffect, useRef } from 'react';
import {
    Box, Button, Dialog, DialogActions,
    DialogContent, DialogTitle, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import QrScanner from 'qr-scanner';

interface QrReaderProps {
    openQr: boolean,
    closeQr: () => void,
    getCode: (code: string) => void
}

export default function ModalQrReader({ closeQr, getCode, openQr }: QrReaderProps) {
    const handleGetCode = (code: string) => {
        getCode(code);
        closeQr();
    }

    return (
        <Dialog
            onClose={closeQr}
            open={openQr}
        >
            <DialogTitle>
                Centralize o QR Code
            </DialogTitle>
            <IconButton
                onClick={closeQr}
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
                {openQr && <QrReaderComponent getCode={handleGetCode} />}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={closeQr} variant='contained'>
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface QrReaderComponentProps {
    getCode: (code: string) => void
}

function QrReaderComponent({ getCode }: QrReaderComponentProps) {
    const scanner = useRef<QrScanner>();
    const videoElement = useRef<HTMLVideoElement>(null);
    const onScanSuccess = (result: QrScanner.ScanResult) => {
        getCode(result.data);
        scanner?.current?.stop();
    };

    useEffect(() => {
        if (videoElement?.current && !scanner.current) {
            scanner.current = new QrScanner(videoElement?.current, onScanSuccess, {
                highlightScanRegion: true,
                highlightCodeOutline: true,
            });
            scanner.current.start()
                .catch((error) => {
                    console.error('Erro ao iniciar o leitor', error);
                    alert('A câmera está bloqueada ou inacessível. Por favor, permita as permissões da câmera no seu navegador e recarregue.');
                });
        }
        // 🧹 Limpe ao desmontar
        // 🚨 Isso remove o QR Scanner da renderização e do uso da câmera quando ele é fechado ou removido da IU.
        return () => {
            if (!videoElement?.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    return (
        <Box position='relative'>
            <Box
                component='video'
                ref={videoElement}
                width='100%'
                height='100%'
                sx={{ objectFit: 'cover' }}
            />
        </Box>
    )
}
'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Close, QrCodeScanner } from '@mui/icons-material';
import QrReader from '../QrReader';
import { useEffect, useState } from 'react';

interface ModalQrReaderProps {
  close: () => void;
  getCode: (url: string) => void;
  onError: (message: string) => void;
  open: boolean;
}

export default function ModalQrReader({
  close,
  getCode,
  onError,
  open,
}: ModalQrReaderProps) {
  const waitingTime = 10;
  const [counter, setCounter] = useState<number>(waitingTime);

  const handleGetCode = (code: string) => {
    getCode(code);
    handleClose();
  };

  const handleError = (message: string) => {
    onError(message);
    handleClose();
  };

  const handleClose = () => {
    setCounter(waitingTime);
    close();
  };

  useEffect(() => {
    if (counter == waitingTime) return;

    if (counter == 0) handleClose();
  }, [counter]);

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog fullWidth onClose={close} open={open}>
      <DialogTitle>
        <Stack alignItems="center" direction="row" gap={1}>
          Centralize o QR Code <QrCodeScanner />
          <IconButton
            color="primary"
            onClick={close}
            size="large"
            sx={{ marginLeft: 'auto', marginRight: '-12px' }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Typography>Envie seu cupom fiscal escaneando seu QR Code.</Typography>
        <QrReader
          getCode={handleGetCode}
          onError={handleError}
          openCamera={open}
        />
      </DialogContent>
    </Dialog>
  );
}

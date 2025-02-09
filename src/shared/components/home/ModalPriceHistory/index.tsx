'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import { Close, History } from '@mui/icons-material';
import lottieLoading from '@/shared/assets/loading-2.json';
import { PriceDto } from '@/server/models/dtos/price';
import { PriceHistoryDto } from '@/server/models/dtos/priceHistory';
import PriceHistoryChart from '../PriceHistoryChart';
import { UpdateChart } from './functions';

interface ModalPriceHistoryProps {
  close: () => void;
  onError: (message: string) => void;
  open: boolean;
  price?: PriceDto;
}

export default function ModalPriceHistory({
  close,
  open,
  onError,
  price,
}: ModalPriceHistoryProps) {
  const [prices, setPrices] = useState<Array<PriceHistoryDto>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [variation, setVariation] = useState(0);

  useEffect(() => {
    setLoading(true);
    UpdateChart(onError, setLoading, setPrices, setVariation, price);
  }, [price]);

  return (
    <Dialog fullWidth onClose={close} open={open} scroll="paper">
      <DialogTitle>
        <Stack alignItems="center" direction="row" gap={1}>
          Histórico de Preços <History />
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
        <Typography>
          Preços registrados para <strong>{price && price.nomeProduto}</strong>{' '}
          no periodo de {prices[0].dataInclusao} a{' '}
          {prices[prices.length].dataInclusao}.
        </Typography>
        <Box display="flex" justifyContent="center" paddingY={2}>
          {loading ? (
            <Player
              autoplay
              keepLastFrame
              loop
              src={lottieLoading}
              style={{
                height: 150,
                width: 150,
              }}
            />
          ) : (
            <PriceHistoryChart height={300} prices={prices} />
          )}
        </Box>
        {prices.length > 0 && !loading && (
          <Typography
            color="primary"
            gutterBottom
            textAlign="center"
            width="100%"
            variant="h6"
          >
            {price && price.nomeMercado}
          </Typography>
        )}
        <DialogContentText>
          Desde o primeiro registro, variação de{' '}
          <strong
            style={{
              color: variation <= 0 ? 'green' : 'red',
            }}
          >
            {loading ? (
              <CircularProgress color="inherit" size={17} />
            ) : (
              `${variation}%`
            )}
          </strong>
          .
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

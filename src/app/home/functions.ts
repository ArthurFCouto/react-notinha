import { PriceDto } from '@/server/models/dtos/price';
import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';

type AlertClose = {
  type: 'close';
};

type AlertOpen = {
  type: 'open';
  message: string;
  severity: 'success' | 'error';
};

type AlertActions = AlertClose | AlertOpen;

interface AlertState {
  message: string;
  severity: 'success' | 'error';
  open: boolean;
}

export function HandleStateAlert(state: AlertState, action: AlertActions) {
  switch (action.type) {
    case 'close':
      return { ...state, open: false };
    case 'open':
      return {
        ...state,
        message: action.message,
        open: true,
        severity: action.severity,
      };
    default:
      return state;
  }
}

export async function SendUrl(
  url: string,
  sendingUrl: boolean,
  setSendingUrl: Dispatch<SetStateAction<boolean>>,
  dispatchAlert: Dispatch<AlertActions>
) {
  if (sendingUrl) {
    dispatchAlert({
      type: 'open',
      message: 'Aguarde e tente mais tarde.',
      severity: 'error',
    });
    return;
  }
  setSendingUrl(true);
  await axios
    .post(`/api/receipts`, { url })
    .then(() => {
      dispatchAlert({
        type: 'open',
        message: 'Obrigado pelo seu envio. Atualize a lista de preços.',
        severity: 'success',
      });
    })
    .catch((response) => {
      dispatchAlert({
        type: 'open',
        message: response.error,
        severity: 'error',
      });
    })
    .finally(() => setSendingUrl(false));
}

export async function UpdateListPrices(
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setOriginalPrices: Dispatch<SetStateAction<PriceDto[]>>,
  dispatchAlert: Dispatch<AlertActions>
) {
  if (loading) return;
  setLoading(true);
  setOriginalPrices([]);
  await axios
    .get(`/api/prices`)
    .then((response) => {
      const { resultados } = response.data;
      if (resultados.length === 0)
        dispatchAlert({
          type: 'open',
          message: 'Não há preços cadastrados no momento.',
          severity: 'error',
        });
      else setOriginalPrices(resultados);
    })
    .catch((response) => {
      dispatchAlert({
        type: 'open',
        message: response.data,
        severity: 'error',
      });
    })
    .finally(() => setLoading(false));
}

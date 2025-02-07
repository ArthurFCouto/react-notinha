import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { PriceHistoryDto } from '@/server/models/dtos/priceHistory';

export async function UpdateChart(
  onError: Function,
  query: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setPrices: Dispatch<SetStateAction<PriceHistoryDto[]>>,
  setVariation: Dispatch<SetStateAction<number>>
) {
  if (query.length == 0) return;

  await axios
    .get(`api/prices/history`, {
      params: {
        idPreco: query,
      },
    })
    .then((response: any) => {
      const { resultados } = response.data;
      setPrices(resultados);
      setVariation(CalculateVariance(resultados));
    })
    .catch((error: any) => {
      onError(error);
      close();
    })
    .finally(() => setLoading(false));
}

function CalculateVariance(list: Array<PriceHistoryDto>) {
  if (list.length == 0 || list.length == 1) return 0;
  const length = list.length;
  const prev = list[0].valor;
  const last = list[length - 1].valor;
  const variance =
    ((parseFloat(last) - parseFloat(prev)) / parseFloat(prev)) * 100;
  return parseFloat(variance.toFixed(2));
}

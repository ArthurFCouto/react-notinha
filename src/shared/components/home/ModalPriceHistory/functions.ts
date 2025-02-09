import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { PriceHistoryDto } from '@/server/models/dtos/priceHistory';
import { PriceDto } from '@/server/models/dtos/price';
import RecordSet from '@/server/models/RecordSet';

export async function UpdateChart(
  onError: Function,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setPrices: Dispatch<SetStateAction<Array<PriceHistoryDto>>>,
  setVariation: Dispatch<SetStateAction<number>>,
  price?: PriceDto
) {
  if (!price) return;

  await axios
    .get(`api/prices/history`, {
      params: {
        idPreco: price.id,
      },
    })
    .then((response) => {
      const data: RecordSet<PriceHistoryDto> = response.data;
      const { resultados } = data;
      setPrices(resultados);
      setVariation(CalculateVariance(resultados));
    })
    .catch((error) => {
      onError(error);
      close();
    })
    .finally(() => setLoading(false));
}

function CalculateVariance(list: Array<PriceHistoryDto>): number {
  if (list.length <= 1) return 0;

  const length = list.length;
  const prev = list[0].valor;
  const last = list[length - 1].valor;
  const variance =
    ((parseFloat(last) - parseFloat(prev)) / parseFloat(prev)) * 100;
  return parseFloat(variance.toFixed(2));
}

import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { BRCurrencyFormat, MappingTimestampToDate } from '@/shared/util';
import { PriceHistory } from '@/server/entities/priceHistory';

export async function UpdateChart(
  onError: Function,
  query: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setPrices: Dispatch<SetStateAction<PriceHistory[]>>,
  setVariation: Dispatch<SetStateAction<number>>
) {
  await axios
    .get(`api/prices/history`, {
      params: {
        idPreco: query,
      },
    })
    .then((response: any) => {
      const { resultados } = response.data;
      const prices = resultados.map((price: PriceHistory) => {
        const valor = BRCurrencyFormat(parseFloat(price.valor))
          .replace(',', '.')
          .slice(3);
        const dataInclusao = MappingTimestampToDate(price.dataInclusao, false);

        return {
          ...price,
          valor,
          dataInclusao,
        };
      });
      setPrices(prices);
      setVariation(CalculateVariance(prices));
    })
    .catch((error: any) => {
      onError(error.response.error);
      close();
    })
    .finally(() => setLoading(false));
}

function CalculateVariance(list: Array<PriceHistory>) {
  if (list.length == 0 || list.length == 1) return 0;
  const length = list.length;
  const prev = list[0].valor;
  const last = list[length - 1].valor;
  const variance =
    ((parseFloat(last) - parseFloat(prev)) / parseFloat(prev)) * 100;
  return parseFloat(variance.toFixed(2));
}

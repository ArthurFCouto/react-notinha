import { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { Price } from '@/server/entities/price';

export async function UpdateChart(
  onError: Function,
  query: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setPrices: Dispatch<SetStateAction<Price[]>>,
  setVariation: Dispatch<SetStateAction<number>>
) {
  await axios
    .get(`/api/prices?idProduto=${query}`)
    .then((response) => {
      setPrices(OrderByDate(response.data));
      setVariation(CalculateVariance(response.data));
    })
    .catch((response) => {
      onError(response.error);
      close();
    })
    .finally(() => setLoading(false));
}

function OrderByDate(list: Price[]) {
  const newList = list.sort(
    (prev, last) => prev.dataInclusao - last.dataInclusao
  );
  const length = newList.length;
  if (length > 10) {
    return newList.slice(length - 10, length - 1);
  }
  return newList;
}

function CalculateVariance(list: Price[]) {
  if (list.length === 0 || list.length === 1) return 0;
  const length = list.length;
  const prev = list[0].valor;
  const last = list[length - 1].valor;
  return parseFloat((((last - prev) / prev) * 100).toFixed(2));
}

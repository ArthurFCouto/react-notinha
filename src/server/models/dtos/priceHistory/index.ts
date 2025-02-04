import { PriceHistoryEntity } from '@/server/entities/priceHistory';

export type PriceHistoryDto = Omit<
  PriceHistoryEntity,
  'idPreco' | 'mapValorData' | 'cnpjMercado'
>;

export function PriceHistoryDtoMapping(
  priceHistory: PriceHistoryEntity
): PriceHistoryDto {
  return {
    id: priceHistory.id,
    valor: priceHistory.valor,
    chaveNotaFiscal: priceHistory.chaveNotaFiscal,
    dataInclusao: priceHistory.dataInclusao,
  };
}

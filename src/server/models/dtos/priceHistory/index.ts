import { PriceHistoryEntity } from '@/server/entities/priceHistory';
import { MappingTimestampToDate } from '@/shared/util';

export type PriceHistoryDto = Omit<
  PriceHistoryEntity,
  'id' | 'idPreco' | 'mapValorData' | 'cnpjMercado' | 'dataInclusao'
> & {
  id: string;
  dataInclusao: string;
};

export function PriceHistoryDtoMapping(
  priceHistory: PriceHistoryEntity
): PriceHistoryDto {
  return {
    id: priceHistory.id!,
    valor: parseFloat(priceHistory.valor).toFixed(2),
    chaveNotaFiscal: priceHistory.chaveNotaFiscal,
    dataInclusao: MappingTimestampToDate(priceHistory.dataInclusao),
  };
}

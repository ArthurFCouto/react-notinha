import { PriceEntity } from '@/server/entities/price';
import { MappingTimestampToDate } from '@/shared/util';

export type PriceDto = Omit<
  PriceEntity,
  | 'id'
  | 'mapValorData'
  | 'mapProdutoMercado'
  | 'mapProdutoMercadoData'
  | 'indexNomeProduto'
  | 'dataInclusao'
> & {
  id: string;
  dataInclusao: string;
};

export function PriceDtoMapping(price: PriceEntity): PriceDto {
  return {
    id: price.id!,
    nomeMercado: price.nomeMercado,
    nomeProduto: price.nomeProduto,
    unidadeMedida: price.unidadeMedida,
    valor: parseFloat(price.valor).toFixed(2),
    cnpjMercado: price.cnpjMercado,
    chaveNotaFiscal: price.chaveNotaFiscal,
    possuiHistorico: price.possuiHistorico,
    dataInclusao: MappingTimestampToDate(price.dataInclusao),
  };
}

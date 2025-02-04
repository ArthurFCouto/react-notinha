import { PriceEntity } from '@/server/entities/price';

export type PriceDto = Omit<
  PriceEntity,
  | 'mapValorData'
  | 'mapProdutoMercado'
  | 'mapProdutoMercadoData'
  | 'indexNomeProduto'
>;

export function PriceDtoMapping(price: PriceEntity): PriceDto {
  return {
    id: price.id,
    nomeMercado: price.nomeMercado,
    nomeProduto: price.nomeProduto,
    unidadeMedida: price.unidadeMedida,
    valor: price.valor,
    cnpjMercado: price.cnpjMercado,
    chaveNotaFiscal: price.chaveNotaFiscal,
    possuiHistorico: price.possuiHistorico,
    dataInclusao: price.dataInclusao,
  };
}

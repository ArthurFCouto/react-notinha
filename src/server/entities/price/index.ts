export type PriceEntity = {
  id?: string;
  mapValorData: string;
  mapProdutoMercado: string;
  mapProdutoMercadoData: string;
  nomeMercado: string;
  nomeProduto: string;
  unidadeMedida: string;
  valor: string;
  cnpjMercado: string;
  chaveNotaFiscal: string;
  possuiHistorico: boolean;
  dataInclusao: number;
};

export function GenerateDateValueMap(
  valor: string,
  dataInclusao: number
): string {
  return `${valor}_${dataInclusao}`;
}

export function GenerateMarketProductMap(
  product: string,
  cnpj: string
): string {
  return `${product.replaceAll(' ', '')}_${cnpj}`;
}

export function GenerateDateMarketProductMap(
  product: string,
  date: number,
  cnpj: string
): string {
  return `${product.replaceAll(' ', '')}_${cnpj}_${date}`;
}

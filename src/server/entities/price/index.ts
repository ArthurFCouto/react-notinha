export type PriceEntity = {
  id?: string;
  mapValorData: string;
  mapProdutoMercado: string;
  mapProdutoMercadoData: string;
  indexNomeProduto: Array<string>;
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

export function GenereteIndexName(product: string): Array<string> {
  const ignore = ['DE', 'KG', 'UN'];

  return product
    .split(/\s+/)
    .filter((str) => str.length > 1 && !ignore.includes(str.toUpperCase()))
    .map((str) => str.replaceAll(/[^a-zA-Z0-9]/g, ''));
}

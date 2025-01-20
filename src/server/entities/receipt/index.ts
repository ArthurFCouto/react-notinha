export type Receipt = {
  id?: string;
  cnpj: string;
  chave: string;
  url: string;
  valorTotal: string;
  idUsuario: string;
  idMercado: string;
  dataEmissao: number;
  dataInclusao: number;
};

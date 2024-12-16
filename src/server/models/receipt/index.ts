export type Receipt = {
  id?: string;
  cnpj: string;
  chave: number;
  data: number;
  url: string;
  valorTotal: number;
  idUsuario: string;
  idMercado: string;
  dataEmissao: number;
  dataInclusao: number;
};

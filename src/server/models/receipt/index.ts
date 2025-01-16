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

export const EmptyReceipt: Receipt = {
  cnpj: '',
  chave: '',
  url: '',
  valorTotal: '0',
  idUsuario: '',
  idMercado: '',
  dataEmissao: 0,
  dataInclusao: 0,
};

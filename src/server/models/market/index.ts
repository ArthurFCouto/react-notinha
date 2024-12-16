export type Market = {
  id?: string;
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  cep: string;
  cidade: string;
  uf: string;
  endereco: string;
  numero: string;
  bairro: string;
  dataInclusao: number;
  dataAtualizacao: number;
};

export const EmptyMarket: Market = {
  nomeFantasia: '',
  razaoSocial: '',
  cnpj: '',
  cep: '',
  cidade: '',
  uf: '',
  endereco: '',
  numero: '',
  bairro: '',
  dataInclusao: 0,
  dataAtualizacao: 0,
};

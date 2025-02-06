import { ReceiptEntity } from '@/server/entities/receipt';

export type ReceiptDto = Omit<ReceiptEntity, 'idUsuario' | 'valorTotal'> & {
  valorTotal: number;
};

export function ReceiptDtoMapping(receipt: ReceiptEntity): ReceiptDto {
  return {
    cnpj: receipt.cnpj,
    chave: receipt.chave,
    url: receipt.url,
    valorTotal: parseFloat(receipt.valorTotal),
    dataEmissao: receipt.dataEmissao,
    dataInclusao: receipt.dataInclusao,
  };
}

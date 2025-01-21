import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Receipt } from '@/server/entities/receipt';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptServiceImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
  }

  async Create(receipt: Receipt): Promise<Receipt> {
    const exist = await ReceiptRepository.CheckIfDoesExist(receipt.chave);
    if (exist.id) {
      throw `400 - Não foi possível concluir o cadastro da nota fiscal (${receipt.chave}). Este cupom já está cadastrado.`;
    }

    delete receipt.id;
    return await addDoc(collection(database, this.path), receipt)
      .then((response) => {
        return {
          id: response.id,
          ...receipt,
        };
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `Create ${this.path}`;
        }
        LogsService.Create(error);
        throw `Não foi possível concluir o cadastro da nota fiscal (${receipt.chave}). ${error.message ?? error}`;
      });
  }

  async DeleteList(receipts: Receipt[]): Promise<void> {
    if (receipts.length == 0) return;

    const pricesWhitoutId = receipts.filter((receipt) => !receipt.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a exclusão pois, todas as notas fiscais da lista devem possuir a propriedade ID, confira novamente a lista enviada.`;
    }

    const batch = writeBatch(database);
    const ids = receipts.map((receipt) => receipt.id);
    ids.forEach((id) => {
      batch.delete(doc(collection(database, this.path), id));
    });

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete ${this.path}`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir a exclusão da lista de notas fiscais. ${error.message ?? error}`;
    });
  }
}

export const ReceiptService = new ReceiptServiceImplements();

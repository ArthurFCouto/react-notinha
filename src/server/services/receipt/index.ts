import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Receipt } from '@/server/entities/receipt';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptServiceImplements {
  private path;
  private batch;

  constructor() {
    this.batch = writeBatch(database);
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
  }

  async Create(receipt: Receipt): Promise<Receipt> {
    const exist = await ReceiptRepository.CheckIfDoesExist(receipt.chave);
    if (exist.id) {
      throw `400 - Erro ao cadastrar ${this.path}. Este cupom já está cadastrado.`;
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
        throw `Erro ao cadastrar ${this.path}. ${error.message ?? error}`;
      });
  }

  async DeleteList(receipts: Receipt[]): Promise<void> {
    if (receipts.length == 0) return;

    const ids = receipts.map((receipt) => receipt.id);

    ids.forEach((id) => {
      this.batch.delete(doc(collection(database, this.path), id));
    });

    await this.batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao deletar lista de ${this.path}. ${error.message ?? error}`;
    });
  }
}

export const ReceiptService = new ReceiptServiceImplements();

import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Receipt } from '@/server/models/receipt';
import { ReceiptRepository } from '@/server/repository/receipt';
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
}

export const ReceiptService = new ReceiptServiceImplements();

import {
  addDoc,
  collection,
  getFirestore,
  writeBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Receipt } from '@/server/models/receipt';
import { ReceiptRepository } from '@/server/repository/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptServiceImplements {
  private database;
  private path = 'notaFiscal';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async Create(receipt: Receipt): Promise<Receipt> {
    const exist = await ReceiptRepository.CheckIfDoesExist(receipt.chave);
    if (exist.id) {
      throw `Erro ao cadastrar ${this.path}. Este cupom já está cadastrado.`;
    }

    delete receipt.id;
    return await addDoc(collection(this.database, this.path), receipt)
      .then((response) => {
        return {
          id: response.id,
          ...receipt,
        };
      })
      .catch((error: FirebaseError) => {
        LogsService.Create(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message}`;
      });
  }
}

export const ReceiptService = new ReceiptServiceImplements();

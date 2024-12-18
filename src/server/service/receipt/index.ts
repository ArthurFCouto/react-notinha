import {
  addDoc,
  collection,
  Firestore,
  getFirestore,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { Receipt } from '@/server/models/receipt';
import { ReceiptRepository } from '@/server/repository/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'notaFiscal';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
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
        SharedService.CreateErrorLog(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message}`;
      });
  }
}

export const ReceiptService = new ReceiptServiceImplements();

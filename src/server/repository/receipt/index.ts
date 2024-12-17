import {
  collection,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedRepository from '../../shared';
import { EmptyReceipt, Receipt } from '@/server/models/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptRepositoryImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'notaFiscal';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CheckIfDoesExist(chave: string): Promise<Receipt> {
    const field = 'chave';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', chave)
    );

    return await getDocs(reference)
      .then((response) => {
        const list = response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        });
        return (list[0] as Receipt) ?? EmptyReceipt;
      })
      .catch((error: FirebaseError) => {
        SharedRepository.CreateErrorLog(error);
        throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
      });
  }
}

export const ReceiptRepository = new ReceiptRepositoryImplements();

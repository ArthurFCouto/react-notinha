import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { LogsService } from '@/server/service/logs';
import { EmptyReceipt, Receipt } from '@/server/models/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptRepositoryImplements {
  private database;
  private path = 'notaFiscal';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async GetAll(): Promise<Receipt[]> {
    const columnOrdem = 'dataInclusao';
    const reference = query(
      collection(this.database, this.path),
      orderBy(columnOrdem)
    );

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Receipt[];
      })
      .catch((error: FirebaseError) => {
        LogsService.Create(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message}`;
      });
  }

  async CheckIfDoesExist(chave: string): Promise<Receipt> {
    const reference = doc(this.database, this.path, chave);
    const snap = await getDoc(reference).catch((error: FirebaseError) => {
      LogsService.Create(error);
      throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
    });

    if (snap.exists()) {
      const market = snap.data();
      return {
        id: snap.id,
        ...market,
      } as Receipt;
    }

    return EmptyReceipt;
  }
}

export const ReceiptRepository = new ReceiptRepositoryImplements();

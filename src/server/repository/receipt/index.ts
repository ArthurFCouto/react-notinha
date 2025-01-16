import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/service/logs';
import { EmptyReceipt, Receipt } from '@/server/models/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptRepositoryImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
  }

  async GetAll(): Promise<Receipt[]> {
    // TO DO - Alterar após unificação
    const columnOrdem =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data';
    const reference = query(
      collection(database, this.path),
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
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'GetAll (Receipt)';
        }
        LogsService.Create(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message ?? error}`;
      });
  }

  async GetTotalAmount(): Promise<number> {
    // TO DO - Alterar após unificação
    const columnOrdem =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data';
    const reference = query(
      collection(database, this.path),
      orderBy(columnOrdem)
    );
    try {
      const snapshot = await getCountFromServer(reference);
      return snapshot.data().count;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'GetTotalAmount (Receipt)';
      }
      LogsService.Create(error);
      throw `Erro ao buscar a lista de ${this.path}. ${error.message ?? error}`;
    }
  }

  async CheckIfDoesExist(chave: string): Promise<Receipt> {
    const field = 'chave';
    const reference = query(
      collection(database, this.path),
      where(field, '==', chave)
    );

    try {
      const snapshot = await getDocs(reference);
      if (snapshot.empty) {
        return EmptyReceipt;
      }

      const object = snapshot.docs[0];
      const receipt = object.data();

      return {
        id: object.id,
        ...receipt,
      } as Receipt;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'CheckIfDoesExist (Receipt)';
      }
      LogsService.Create(error);
      throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message ?? error}`;
    }
  }
}

export const ReceiptRepository = new ReceiptRepositoryImplements();

import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { PriceHistory } from '@/server/models/priceHistory';

class PriceHistoryRespositoryImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'historicoDePrecos';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CreateList(list: PriceHistory[]) {
    list.forEach((price) => {
      delete price.id;
      const reference = doc(collection(this.database, this.path));
      this.batch.set(reference, price);
    });

    return await this.batch.commit().catch((error: FirebaseError) => {
      SharedService.CreateErrorLog(error);
      throw `Erro ao cadastrar histórico de preços. ${error.message}`;
    });
  }

  async GetAllByProduto(id: string): Promise<PriceHistory[]> {
    const field = 'idProduto';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', id)
    );

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as PriceHistory[];
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar histórico de preços. ${error.message}`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

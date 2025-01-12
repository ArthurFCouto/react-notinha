import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getDocs,
  getFirestore,
  Query,
  query,
  where,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { LogsService } from '@/server/service/logs';
import { PriceHistory } from '@/server/models/priceHistory';

class PriceHistoryRespositoryImplements {
  private database;
  private path = 'historicoDePrecos';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async GetAllByProduto(id: string): Promise<PriceHistory[]> {
    const field = 'idProduto';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', id)
    );

    return this.GetDocsReturnPricesHistory(reference);
  }

  async GetAllByMarket(id: string, data?: number): Promise<PriceHistory[]> {
    const fieldId = 'idMercado';
    const fieldData = 'dataInclusao';
    const reference = data
      ? query(
          collection(this.database, this.path),
          and(where(fieldId, '==', id), where(fieldData, '==', data))
        )
      : query(collection(this.database, this.path), where(fieldId, '==', id));

    return this.GetDocsReturnPricesHistory(reference);
  }

  private async GetDocsReturnPricesHistory(
    reference: Query
  ): Promise<PriceHistory[]> {
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
        LogsService.Create(error);
        throw `Erro ao buscar histórico de preços. ${error.message}`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

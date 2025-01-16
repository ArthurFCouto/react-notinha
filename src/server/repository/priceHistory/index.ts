import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getDocs,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/service/logs';
import { PriceHistory } from '@/server/models/priceHistory';

class PriceHistoryRespositoryImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
  }

  async GetAllByProduto(id: string): Promise<PriceHistory[]> {
    const field = 'idProduto';
    const reference = query(
      collection(database, this.path),
      where(field, '==', id)
    );

    return this.GetDocsReturnPricesHistory(reference, 'GetAllByProduto');
  }

  async GetAllByMarket(
    idMarket: string,
    date?: number
  ): Promise<PriceHistory[]> {
    const fieldIdMarket = 'idMercado';
    const fieldDate = 'dataInclusao';
    const reference = date
      ? query(
          collection(database, this.path),
          and(
            where(fieldIdMarket, '==', idMarket),
            where(fieldDate, '==', date)
          )
        )
      : query(
          collection(database, this.path),
          where(fieldIdMarket, '==', idMarket)
        );

    return this.GetDocsReturnPricesHistory(reference, 'GetAllByMarket');
  }

  private async GetDocsReturnPricesHistory(
    reference: Query,
    stack: String
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
        if (typeof error != 'string') {
          error.stack = error.stack ?? `${stack} ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar histórico de preços. ${error.message}`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  startAt,
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

  async GetAll(offSet?: number, amount?: number): Promise<PriceHistory[]> {
    // TO DO - Alterar após unificação
    const field = 'idPreco';
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            orderBy(field),
            startAt(offSet),
            limit(amount)
          )
        : query(collection(database, this.path), orderBy(field));

    return this.GetDocsReturnPricesHistory(reference, 'GetAll');
  }

  async GetListByPrice(priceId: string): Promise<PriceHistory[]> {
    const field = 'idPreco';
    const reference = query(
      collection(database, this.path),
      where(field, '==', priceId)
    );

    return this.GetDocsReturnPricesHistory(reference, 'GetListByPrice');
  }

  async GetListByListPriceId(priceIds: Array<string>): Promise<PriceHistory[]> {
    const reference = query(collection(database, this.path));
    const prices: Array<PriceHistory> = [];

    await getDocs(reference)
      .then((response) => {
        response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as PriceHistory;
          if (priceIds.includes(price.idPreco)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetListByListPriceId ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar ${this.path} por lista de preços. ${error.message}`;
      });

    return prices;
  }

  async GetListByMarket(
    marketId: string,
    date?: number
  ): Promise<PriceHistory[]> {
    const fieldIdMarket = 'idMercado';
    const fieldDate = 'dataInclusao';
    const reference = date
      ? query(
          collection(database, this.path),
          and(
            where(fieldIdMarket, '==', marketId),
            where(fieldDate, '==', date)
          )
        )
      : query(
          collection(database, this.path),
          where(fieldIdMarket, '==', marketId)
        );

    return this.GetDocsReturnPricesHistory(reference, 'GetListByMarket');
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
          error.stack = error.stack ?? `${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar ${this.path}. ${error.message}`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

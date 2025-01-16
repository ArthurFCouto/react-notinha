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
import { Price } from '@/server/models/price';
import { PriceHistoryRepository } from '../priceHistory';

class PriceRepositoryImplements {
  private path;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
  }

  async GetAll(offSet?: number, amount?: number): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const field =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto';
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            orderBy(field),
            startAt(offSet),
            limit(amount)
          )
        : query(collection(database, this.path), orderBy(field));

    return this.GetDocsReturnPrices(reference, 'GetAll');
  }

  async GetListByName(name: string): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const field =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto';
    const reference = query(
      collection(database, this.path),
      where(field, '==', name)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByName');
  }

  async GetListByMarket(marketId: string): Promise<Price[]> {
    const fieldIdMarket = 'idMercado';
    const reference = query(
      collection(database, this.path),
      where(fieldIdMarket, '==', marketId)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByMarket');
  }

  async GetListByNameAndMarket(
    name: string,
    marketId: string
  ): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const fieldProduct =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto';
    const fieldIdMarket = 'idMercado';
    const reference = query(
      collection(database, this.path),
      and(where(fieldProduct, '==', name), where(fieldIdMarket, '==', marketId))
    );

    return this.GetDocsReturnPrices(reference, 'GetListByNameAndMarket');
  }

  async GetListByDate(date: number): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const field =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data';
    const reference = query(
      collection(database, this.path),
      where(field, '==', date)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByDate');
  }

  async GetListByReceipt(receiptIds: Array<string>): Promise<Price[]> {
    const reference = query(collection(database, this.path));
    const prices: Array<Price> = [];

    await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as Price;
          if (receiptIds.includes(price.idNotaFiscal)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetListByReceipt ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de ${this.path} por IdNotaFiscal. ${error.message ?? error}`;
      });

    return prices;
  }

  async GetListById(ids: Array<string>): Promise<Price[]> {
    const reference = query(collection(database, this.path));
    const prices: Array<Price> = [];

    await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as Price;
          if (ids.includes(doc.id)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetListById ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de ${this.path} por ID. ${error.message ?? error}`;
      });

    return prices;
  }

  async GetOnlyWithHistoric(): Promise<Price[]> {
    const pricesHistory = await PriceHistoryRepository.GetAll();
    const idsPricesHistory = Array.from(
      new Set(pricesHistory.map((priceHistory) => priceHistory.idPreco))
    );
    const reference = query(collection(database, this.path));
    const prices: Array<Price> = [];

    await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as Price;
          if (idsPricesHistory.includes(doc.id)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetOnlyWithHistoric ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de ${this.path} que possuem histórico. ${error.message ?? error}`;
      });

    return prices;
  }

  private async GetDocsReturnPrices(
    reference: Query,
    stack: string
  ): Promise<Price[]> {
    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Price[];
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `${stack} ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar os ${this.path}. ${error.message ?? String(error)}`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

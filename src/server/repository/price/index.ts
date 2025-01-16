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

  async GetAllByName(name: string): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const field =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto';
    const reference = query(
      collection(database, this.path),
      where(field, '==', name)
    );

    return this.GetDocsReturnPrices(reference, 'GetAllByName');
  }

  async GetAllByMarket(idMarket: string): Promise<Price[]> {
    const fieldIdMarket = 'idMercado';
    const reference = query(
      collection(database, this.path),
      where(fieldIdMarket, '==', idMarket)
    );

    return this.GetDocsReturnPrices(reference, 'GetAllByMarket');
  }

  async GetAllByNameAndMarket(
    name: string,
    idMarket: string
  ): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const fieldProduct =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto';
    const fieldIdMarket = 'idMercado';
    const reference = query(
      collection(database, this.path),
      and(where(fieldProduct, '==', name), where(fieldIdMarket, '==', idMarket))
    );

    return this.GetDocsReturnPrices(reference, 'GetAllByNameAndMarket');
  }

  async GetAllByDate(date: number): Promise<Price[]> {
    // TO DO - Alterar após unificação
    const field =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data';
    const reference = query(
      collection(database, this.path),
      where(field, '==', date)
    );

    return this.GetDocsReturnPrices(reference, 'GetAllByDate');
  }

  async GetByIdList(ids: Array<string>): Promise<Price[]> {
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
          error.stack = error.stack ?? `GetByIdList ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de preços por ID. ${error.message ?? error}`;
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
        throw `Erro ao buscar os preços. ${error.message ?? String(error)}`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

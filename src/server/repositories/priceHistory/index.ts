import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getDocs,
  orderBy,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/services/logs';
import { PriceHistory } from '@/server/entities/priceHistory';

class PriceHistoryRespositoryImplements {
  private path;
  private fieldOrder;
  private fieldProduct;
  private fieldIdMarket;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
    this.fieldOrder = 'dataInclusao';
    this.fieldProduct = 'idPreco';
    this.fieldIdMarket = 'idMercado';
  }

  async GetAll(): Promise<Array<PriceHistory>> {
    const reference = query(
      collection(database, this.path),
      orderBy(this.fieldOrder)
    );

    return this.GetDocsReturnPricesHistory(reference, 'GetAll');
  }

  // TO DO - Criar método para filtrar por período
  async GetListByPriceId(priceId: string): Promise<Array<PriceHistory>> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldProduct, '==', priceId),
      orderBy(this.fieldProduct),
      orderBy(this.fieldOrder)
    );

    return this.GetDocsReturnPricesHistory(reference, 'GetListByPrice');
  }

  async GetListByPriceIdList(
    priceIds: Array<string>
  ): Promise<Array<PriceHistory>> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldProduct, 'in', priceIds)
    );

    return this.GetDocsReturnPricesHistory(reference, 'GetListByListPriceId');
  }

  async GetListByMarket(
    marketId: string,
    date?: number
  ): Promise<Array<PriceHistory>> {
    const reference = date
      ? query(
          collection(database, this.path),
          and(
            where(this.fieldIdMarket, '==', marketId),
            where(this.fieldOrder, '==', date)
          )
        )
      : query(
          collection(database, this.path),
          where(this.fieldIdMarket, '==', marketId)
        );

    return this.GetDocsReturnPricesHistory(reference, 'GetListByMarket');
  }

  private async GetDocsReturnPricesHistory(
    reference: Query,
    stack: String
  ): Promise<Array<PriceHistory>> {
    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<PriceHistory>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar o histórico de preços. ${error.message}`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

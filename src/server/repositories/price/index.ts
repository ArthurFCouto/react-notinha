import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  Query,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/services/logs';
import { Price } from '@/server/entities/price';

class PriceRepositoryImplements {
  private path;
  private fieldProduct;
  private fieldIdMarket;
  private fieldDate;
  private fieldIdReceipt;
  private fieldHasHistoric;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
    this.fieldProduct =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto'; // TO DO - Alterar após unificação
    this.fieldIdMarket = 'idMercado';
    this.fieldDate =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data'; // TO DO - Alterar após unificação
    this.fieldIdReceipt = 'idNotaFiscal';
    this.fieldHasHistoric = 'possuiHistorico';
  }

  async GetAll(offSet?: number, amount?: number): Promise<Array<Price>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            orderBy(this.fieldProduct),
            startAt(offSet),
            limit(amount)
          )
        : query(collection(database, this.path), orderBy(this.fieldProduct));

    return this.GetDocsReturnPrices(reference, 'GetAll');
  }

  async GetListByName(
    product: string,
    offSet?: number,
    amount?: number
  ): Promise<Array<Price>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            where(this.fieldProduct, '==', product),
            orderBy(this.fieldProduct),
            startAt(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            where(this.fieldProduct, '==', product),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByName');
  }

  async GetListByMarket(
    marketId: string,
    offSet?: number,
    amount?: number
  ): Promise<Array<Price>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            where(this.fieldIdMarket, '==', marketId),
            orderBy(this.fieldIdMarket),
            orderBy(this.fieldProduct),
            startAt(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            where(this.fieldIdMarket, '==', marketId),
            orderBy(this.fieldIdMarket),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByMarket');
  }

  async GetListByNameAndMarket(
    product: string,
    marketId: string,
    offSet?: number,
    amount?: number
  ): Promise<Array<Price>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            and(
              where(this.fieldProduct, '==', product),
              where(this.fieldIdMarket, '==', marketId)
            ),
            orderBy(this.fieldProduct),
            orderBy(this.fieldIdMarket),
            startAt(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            and(
              where(this.fieldProduct, '==', product),
              where(this.fieldIdMarket, '==', marketId)
            ),
            orderBy(this.fieldProduct),
            orderBy(this.fieldIdMarket)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByNameAndMarket');
  }

  async GetListByDate(
    startDate: number,
    endDate: number,
    offSet?: number,
    amount?: number
  ): Promise<Array<Price>> {
    const dateIsValid = this.DatesAreValid(startDate, endDate);
    if (!dateIsValid) {
      throw `401 - As datas enviadas não estão dentro do período esperado. Data inicial informada ${startDate} - Data final informada ${endDate}.`;
    }

    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            and(
              where(this.fieldDate, '>=', startDate),
              where(this.fieldDate, '<=', endDate)
            ),
            orderBy(this.fieldDate),
            orderBy(this.fieldProduct),
            startAt(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            and(
              where(this.fieldDate, '>=', startDate),
              where(this.fieldDate, '<=', endDate)
            ),
            orderBy(this.fieldDate),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByDate');
  }

  async GetListByReceipt(receiptIds: Array<string>): Promise<Array<Price>> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldIdReceipt, 'in', receiptIds),
      orderBy(this.fieldIdReceipt),
      orderBy(this.fieldProduct)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByReceipt');
  }

  async GetListById(ids: Array<string>): Promise<Array<Price>> {
    const reference = query(collection(database, this.path));
    const prices: Array<Price> = [];

    await getDocs(reference)
      .then((response) => {
        response.docs.map((doc) => {
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
          error.stack = error.stack ?? `GetListById (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de produtos por ID. ${error.message ?? error}`;
      });

    return prices;
  }

  async GetOnlyWithHistoric(
    offSet?: number,
    amount?: number
  ): Promise<Array<Price>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            or(
              where(this.fieldHasHistoric, '==', true),
              where(this.fieldHasHistoric, '==', 'true')
            ),
            orderBy(this.fieldHasHistoric),
            orderBy(this.fieldProduct),
            startAt(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            or(
              where(this.fieldHasHistoric, '==', true),
              where(this.fieldHasHistoric, '==', 'true')
            ),
            orderBy(this.fieldHasHistoric),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetOnlyWithHistoric');
  }

  private DatesAreValid(startDate: number, endDate: number): boolean {
    if (endDate < startDate) {
      return false;
    }

    const oneDayInMs = 24 * 60 * 60 * 1000;
    const diffInMs = endDate - startDate;
    const diffInDays = diffInMs / oneDayInMs;

    return diffInDays <= 30;
  }

  private async GetDocsReturnPrices(
    reference: Query,
    stack: string
  ): Promise<Array<Price>> {
    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<Price>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de produtos. ${error.message ?? error}`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

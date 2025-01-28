import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  or,
  orderBy,
  Query,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/services/logs';
import { PriceEntity } from '@/server/entities/price';

interface GetTotalAmountProps {
  product?: string;
  cnpjMarket?: string;
  startDate?: number;
  endDate?: number;
  onlyWithHistoric?: boolean;
}

class PriceRepositoryImplements {
  private path;
  private fieldProduct;
  private fieldCnpjMarket;
  private fieldKeyMarketProduct;
  private fieldDate;
  private fieldKeyReceipt;
  private fieldHasHistoric;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
    this.fieldProduct =
      process.env.NODE_ENV === 'development' ? 'nomeProduto' : 'produto'; // TO DO - Alterar após unificação
    this.fieldCnpjMarket = 'cnpjMercado';
    this.fieldKeyMarketProduct = 'chaveProdutoMercado';
    this.fieldDate =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data'; // TO DO - Alterar após unificação
    this.fieldKeyReceipt = 'chaveNotaFiscal';
    this.fieldHasHistoric = 'possuiHistorico';
  }

  async GetAll(offSet?: string, amount?: number): Promise<Array<PriceEntity>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            orderBy(this.fieldProduct),
            startAfter(offSet),
            limit(amount)
          )
        : query(collection(database, this.path), orderBy(this.fieldProduct));

    return this.GetDocsReturnPrices(reference, 'GetAll');
  }

  async GetListByName(
    product: string,
    offSet?: string,
    amount?: number
  ): Promise<Array<PriceEntity>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            where(this.fieldProduct, '==', product),
            orderBy(this.fieldProduct),
            startAfter(offSet),
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
    cnpj: string,
    offSet?: string,
    amount?: number
  ): Promise<Array<PriceEntity>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            where(this.fieldCnpjMarket, '==', cnpj),
            orderBy(this.fieldCnpjMarket),
            orderBy(this.fieldProduct),
            startAfter(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            where(this.fieldCnpjMarket, '==', cnpj),
            orderBy(this.fieldCnpjMarket),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByMarket');
  }

  async GetListByNameAndMarket(
    keyMarketProduct: string,
    offSet?: string,
    amount?: number
  ): Promise<Array<PriceEntity>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            where(this.fieldKeyMarketProduct, '==', keyMarketProduct),
            orderBy(this.fieldKeyMarketProduct),
            orderBy(this.fieldProduct),
            startAfter(offSet),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            where(this.fieldKeyMarketProduct, '==', keyMarketProduct),
            orderBy(this.fieldKeyMarketProduct),
            orderBy(this.fieldProduct)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByNameAndMarket');
  }

  // TO DO - Validar lógica deste método
  async GetListByDate(
    startDate: number,
    endDate: number,
    offSet?: string,
    amount?: number
  ): Promise<Array<PriceEntity>> {
    const dateIsValid = this.DatesAreValid(startDate, endDate);
    if (!dateIsValid) {
      throw `400 - Favor checar os valores informados para as datas. Data inicial informada ${startDate} - Data final informada ${endDate}.`;
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
            startAfter(offSet),
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

  // TO DO - Tratar o caso de quando receiptIds for uma quantidade superior a 30
  async GetListByReceiptList(
    receiptKeys: Array<string>
  ): Promise<Array<PriceEntity>> {
    if (receiptKeys.length == 0) {
      return [];
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldKeyReceipt, 'in', receiptKeys),
      orderBy(this.fieldKeyReceipt),
      orderBy(this.fieldProduct)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByReceiptList');
  }

  // TO DO - Validar mapeamento do Id
  async GetListByIdList(ids: Array<string>): Promise<Array<PriceEntity>> {
    const reference = query(collection(database, this.path));
    const prices: Array<PriceEntity> = [];

    await getDocs(reference)
      .then((response) => {
        response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as PriceEntity;
          if (ids.includes(doc.id)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetListById (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de produtos por ID.`;
      });

    return prices;
  }

  async GetOnlyWithHistoric(
    offSet?: string,
    amount?: number
  ): Promise<Array<PriceEntity>> {
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
            startAfter(offSet),
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

  async GetTotalAmount(props: GetTotalAmountProps): Promise<number> {
    const { product, cnpjMarket, startDate, endDate, onlyWithHistoric } = props;
    const queryConstraints = [];

    product && queryConstraints.push(where(this.fieldProduct, '==', product));
    cnpjMarket &&
      queryConstraints.push(where(this.fieldCnpjMarket, '==', cnpjMarket));
    startDate && queryConstraints.push(where(this.fieldDate, '>=', startDate));
    endDate && queryConstraints.push(where(this.fieldDate, '<=', endDate));
    onlyWithHistoric &&
      queryConstraints.push(
        where(this.fieldHasHistoric, '==', true),
        where(this.fieldHasHistoric, '==', 'true')
      );

    const reference = query(
      collection(database, this.path),
      and(...queryConstraints)
    );
    try {
      const snapshot = await getCountFromServer(reference);
      return snapshot.data().count;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `GetTotalAmount (${this.path})`;
      }
      LogsService.Create(error);
      throw `Ocorreu um erro enquanto buscávamos a quantidade total de produtos.`;
    }
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
  ): Promise<Array<PriceEntity>> {
    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<PriceEntity>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de produtos.`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  doc,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
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
  path;
  private fieldProduct;
  private fieldIndexProduct;
  private fieldCnpjMarket;
  private fieldDate;
  private fieldKeyReceipt;
  private fieldHasHistoric;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
    this.fieldProduct = 'nomeProduto';
    this.fieldIndexProduct = 'indexNomeProduto';
    this.fieldCnpjMarket = 'cnpjMercado';
    this.fieldDate = 'dataInclusao';
    this.fieldKeyReceipt = 'chaveNotaFiscal';
    this.fieldHasHistoric = 'possuiHistorico';
  }

  async GetAll(offSet: string, amount: number): Promise<Array<PriceEntity>> {
    if (offSet.length > 0) {
      const snapshot = await this.GetSnapshot(offSet);
      const reference = query(
        collection(database, this.path),
        orderBy(this.fieldProduct),
        startAfter(snapshot),
        limit(amount)
      );

      return this.GetDocsReturnPrices(reference, 'GetAll');
    }

    const reference = query(
      collection(database, this.path),
      orderBy(this.fieldProduct),
      limit(amount)
    );

    return this.GetDocsReturnPrices(reference, 'GetAll');
  }

  async GetListByName(
    product: string,
    offSet: string,
    amount: number
  ): Promise<Array<PriceEntity>> {
    if (offSet.length > 0) {
      const snapshot = await this.GetSnapshot(offSet);
      const reference = query(
        collection(database, this.path),
        where(this.fieldIndexProduct, 'array-contains', product),
        orderBy(this.fieldProduct),
        startAfter(snapshot),
        limit(amount)
      );

      return this.GetDocsReturnPrices(reference, 'GetListByName');
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldIndexProduct, 'array-contains', product),
      orderBy(this.fieldProduct),
      limit(amount)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByName');
  }

  async GetListByMarketModel(cnpj: string): Promise<Array<PriceEntity>> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldCnpjMarket, '==', cnpj)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByMarketModel');
  }

  async GetListByMarket(
    cnpj: string,
    offSet: string,
    amount: number
  ): Promise<Array<PriceEntity>> {
    if (offSet.length > 0) {
      const snapshot = await this.GetSnapshot(offSet);
      const reference = query(
        collection(database, this.path),
        where(this.fieldCnpjMarket, '==', cnpj),
        orderBy(this.fieldCnpjMarket),
        orderBy(this.fieldProduct),
        startAfter(snapshot),
        limit(amount)
      );

      return this.GetDocsReturnPrices(reference, 'GetListByMarket');
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldCnpjMarket, '==', cnpj),
      orderBy(this.fieldCnpjMarket),
      orderBy(this.fieldProduct),
      limit(amount)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByMarket');
  }

  // TO DO - Validar lógica deste método
  async GetListByDate(
    startDate: number,
    endDate: number,
    offSet: string,
    amount: number
  ): Promise<Array<PriceEntity>> {
    const dateIsValid = this.DatesAreValid(startDate, endDate);
    if (!dateIsValid) {
      throw `400 - Favor checar os valores informados para as datas. Data inicial informada ${startDate} - Data final informada ${endDate}.`;
    }

    let first = null;
    let snapshot = null;
    if (offSet.length > 0) {
      first = doc(database, this.path, offSet);
      snapshot = await getDoc(first);
    }

    const reference =
      offSet.length > 0
        ? query(
            collection(database, this.path),
            and(
              where(this.fieldDate, '>=', startDate),
              where(this.fieldDate, '<=', endDate)
            ),
            orderBy(this.fieldDate),
            orderBy(this.fieldProduct),
            startAfter(snapshot),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            and(
              where(this.fieldDate, '>=', startDate),
              where(this.fieldDate, '<=', endDate)
            ),
            orderBy(this.fieldDate),
            orderBy(this.fieldProduct),
            limit(amount)
          );

    return this.GetDocsReturnPrices(reference, 'GetListByDate');
  }

  async GetListByReceiptKeys(
    receiptKeys: Array<string>
  ): Promise<Array<PriceEntity>> {
    if (receiptKeys.length === 0) {
      return [];
    } else if (receiptKeys.length > 30) {
      throw `400 - Não é possível buscar mais de 30 objetos por vez, reduza a quantidade de objetos pesquisados (${receiptKeys.length}).`;
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldKeyReceipt, 'in', receiptKeys),
      orderBy(this.fieldKeyReceipt),
      orderBy(this.fieldProduct)
    );

    return this.GetDocsReturnPrices(reference, 'GetListByReceiptList');
  }

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
          error.message = `${error.message} - GetListById (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de produtos por ID.`;
      });

    return prices;
  }

  async GetOnlyWithHistoric(
    offSet: string,
    amount: number
  ): Promise<Array<PriceEntity>> {
    if (offSet.length > 0) {
      const snapshot = await this.GetSnapshot(offSet);
      const reference = query(
        collection(database, this.path),
        where(this.fieldHasHistoric, '==', true),
        orderBy(this.fieldHasHistoric),
        orderBy(this.fieldProduct),
        startAfter(snapshot),
        limit(amount)
      );

      return this.GetDocsReturnPrices(reference, 'GetOnlyWithHistoric');
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldHasHistoric, '==', true),
      orderBy(this.fieldHasHistoric),
      orderBy(this.fieldProduct),
      limit(amount)
    );

    return this.GetDocsReturnPrices(reference, 'GetOnlyWithHistoric');
  }

  async GetTotalAmount(props: GetTotalAmountProps): Promise<number> {
    const { product, cnpjMarket, startDate, endDate, onlyWithHistoric } = props;
    const queryConstraints = [];

    product &&
      queryConstraints.push(
        where(this.fieldIndexProduct, 'array-contains', product)
      );
    cnpjMarket &&
      queryConstraints.push(where(this.fieldCnpjMarket, '==', cnpjMarket));
    onlyWithHistoric &&
      queryConstraints.push(where(this.fieldHasHistoric, '==', true));
    if (startDate && endDate) {
      queryConstraints.push(where(this.fieldDate, '>=', startDate));
      queryConstraints.push(where(this.fieldDate, '<=', endDate));
    }

    const reference =
      queryConstraints.length > 0
        ? query(collection(database, this.path), and(...queryConstraints))
        : query(collection(database, this.path));

    try {
      const snapshot = await getCountFromServer(reference);
      return snapshot.data().count;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - GetTotalAmount (${this.path})`;
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

  private async GetSnapshot(offSet: string): Promise<DocumentSnapshot> {
    const first = doc(database, this.path, offSet);
    return await getDoc(first);
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
          error.message = `${error.message} - ${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de produtos.`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

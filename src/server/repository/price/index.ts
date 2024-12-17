import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  Query,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedRepository from '../../shared';
import { Price } from '@/server/models/price';

class PriceRepositoryImplements {
  private database: Firestore;
  private path = 'precos';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async GetAll(offSet?: number, amount?: number): Promise<Price[]> {
    const field = 'nomeProduto';
    const reference =
      offSet && amount
        ? query(
            collection(this.database, this.path),
            orderBy(field),
            startAt(offSet),
            limit(amount)
          )
        : query(collection(this.database, this.path), orderBy(field));

    return this.GetDocsReturnPrices(reference);
  }

  async GetAllByName(name: string): Promise<Price[]> {
    const field = 'nomeProduto';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', name)
    );

    return this.GetDocsReturnPrices(reference);
  }

  async GetAllByMarket(idMarket: string): Promise<Price[]> {
    const fieldMercado = 'idMercado';
    const reference = query(
      collection(this.database, this.path),
      where(fieldMercado, '==', idMarket)
    );

    return this.GetDocsReturnPrices(reference);
  }

  async GetAllByNameAndMarket(
    name: string,
    idMarket: string
  ): Promise<Price[]> {
    const fieldProduto = 'nomeProduto';
    const fieldMercado = 'idMercado';
    const reference = query(
      collection(this.database, this.path),
      and(where(fieldProduto, '==', name), where(fieldMercado, '==', idMarket))
    );

    return this.GetDocsReturnPrices(reference);
  }

  async GetAllByDate(date: number): Promise<Price[]> {
    const field = 'dataInclusao';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', date)
    );

    return this.GetDocsReturnPrices(reference);
  }

  private async GetDocsReturnPrices(reference: Query): Promise<Price[]> {
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
        SharedRepository.CreateErrorLog(error);
        throw `Erro ao buscar os preços. ${error.message}`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

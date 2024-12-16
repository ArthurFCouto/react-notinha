import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { Price } from '@/server/models/price';

class PriceRepositoryImplements {
  private database: Firestore;
  private path = 'precos';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async GetAll(offSet?: number, amount?: number): Promise<Price[]> {
    const field = 'nomeProduto';
    // const reference = query(collection(this.database, this.path), orderBy(field), startAt(offSet), limit(amount));
    const reference = query(
      collection(this.database, this.path),
      orderBy(field)
    );

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
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar a lista de precos. ${error.message}`;
      });
  }

  async GetAllByName(name: string): Promise<Price[]> {
    const field = 'nomeProduto';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', name)
    );
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
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar a lista de preços pelo nome. ${error.message}`;
      });
  }

  async GetAllByMarket(idMarket: string): Promise<Price[]> {
    const fieldMercado = 'idMercado';
    const reference = query(
      collection(this.database, this.path),
      where(fieldMercado, '==', idMarket)
    );

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
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar preços pelo mercado. ${error.message}`;
      });
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
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar preços pelo nome e mercado. ${error.message}`;
      });
  }

  async GetAllByDate(date: number): Promise<Price[]> {
    const field = 'dataInclusao';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', date)
    );

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
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar os preços por data. ${error.message}`;
      });
  }
}

export const PriceRepository = new PriceRepositoryImplements();

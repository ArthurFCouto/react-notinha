import { FirebaseError } from 'firebase/app';
import {
  and,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../shared';
import { Price } from '@/server/models/price';

class PriceServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'precos';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CreateList(list: Price[]) {
    const { dataInclusao } = list[0];
    const PricesOfTheDay = await this.GetAllByDate(dataInclusao).then(
      (prices) =>
        prices.map(
          (price) => `${price.nomeProduto}_${price.idMercado}_${price.valor}`
        )
    );

    list.forEach((price) => {
      const key = `${price.nomeProduto}_${price.idMercado}_${price.valor}`;
      if (PricesOfTheDay.includes(key)) return;

      delete price.id;
      const reference = doc(collection(this.database, this.path));
      this.batch.set(reference, price);
    });

    return await this.batch.commit().catch((error: FirebaseError) => {
      SharedService.CreateErrorLog(error);
      throw `Erro ao cadastrar lista de preços. ${error.message}`;
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
        throw `Erro ao buscar os preços pela data. ${error.message}`;
      });
  }

  /*
    export async function getPriceListWithPagination(start: number, end: number): Promise<Price[]> {
        const database = getFirestore(firebase);
        const ref = query(collection(database, pathPrecos), orderBy('produto'), startAt(start), limit(end));
        return await getDocs(ref)
            .then((response) => {
                return response.docs.map((doc) => {
                    const object = doc.data();
                    return {
                        id: doc.id,
                        ...object
                    }
                }) as Price[];
            })
            .catch((error: FirebaseError) => {
                createErrorLog(error);
                throw (`Erro ao buscar a lista de precos. ${error.message}`);
            });
    };
    */
}

export const PriceService = new PriceServiceImplements();

import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { EmptyMarket, Market } from '@/server/models/market';
import SharedService from '../../shared';

class MarketServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'mercado';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async Create(data: Market): Promise<string> {
    delete data.id;

    const market = await this.CheckIfDoesExist(data.cnpj);
    if (market.id) return market.id;

    return await addDoc(collection(this.database, this.path), data)
      .then((response) => {
        return response.id;
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message}`;
      });
  }

  async GetAll(): Promise<Market[]> {
    const columnOrdem = 'nomeFantasia';
    const reference = query(
      collection(this.database, this.path),
      orderBy(columnOrdem)
    );

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Market[];
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message}`;
      });
  }

  private async CheckIfDoesExist(cnpj: string): Promise<Market> {
    const field = 'cnpj';
    const reference = query(
      collection(this.database, this.path),
      where(field, '==', cnpj)
    );

    return await getDocs(reference)
      .then((response) => {
        const list = response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        });
        return (list[0] as Market) ?? EmptyMarket;
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
      });
  }
}

export const MarketService = new MarketServiceImplements();

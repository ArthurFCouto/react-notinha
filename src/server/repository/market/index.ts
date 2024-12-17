import { FirebaseError } from 'firebase/app';
import {
  collection,
  Firestore,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { EmptyMarket, Market } from '@/server/models/market';
import SharedRepository from '../../shared';

class MarketRepositoryImplements {
  private database: Firestore;
  private path = 'mercado';

  constructor() {
    this.database = getFirestore(firebase);
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
        SharedRepository.CreateErrorLog(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message}`;
      });
  }

  async CheckIfDoesExist(cnpj: string): Promise<Market> {
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
        SharedRepository.CreateErrorLog(error);
        throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
      });
  }
}

export const MarketRepository = new MarketRepositoryImplements();

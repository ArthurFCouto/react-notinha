import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { EmptyMarket, Market } from '@/server/models/market';
import { LogsService } from '@/server/service/logs';

class MarketRepositoryImplements {
  private database;
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
        LogsService.Create(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message}`;
      });
  }

  async CheckIfDoesExist(cnpj: string): Promise<Market> {
    const reference = doc(this.database, this.path, cnpj);
    const snap = await getDoc(reference).catch((error: FirebaseError) => {
      LogsService.Create(error);
      throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
    });

    if (snap.exists()) {
      const market = snap.data();
      return {
        id: snap.id,
        ...market,
      } as Market;
    }

    return EmptyMarket;

    const field = 'cnpj';
    const reference1 = query(
      collection(this.database, this.path),
      where(field, '==', cnpj)
    );

    return await getDocs(reference1)
      .then((response) => {
        const list = response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        });
        return list.length > 0 ? (list[0] as Market) : EmptyMarket;
      })
      .catch((error: FirebaseError) => {
        LogsService.Create(error);
        throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`;
      });
  }
}

export const MarketRepository = new MarketRepositoryImplements();

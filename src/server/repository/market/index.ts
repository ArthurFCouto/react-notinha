import { FirebaseError } from 'firebase/app';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { EmptyMarket, Market } from '@/server/models/market';
import { LogsService } from '@/server/service/logs';

class MarketRepositoryImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'mercadoDev' : 'mercado';
  }

  async GetAll(): Promise<Market[]> {
    const columnOrdem = 'nomeFantasia';
    const reference = query(
      collection(database, this.path),
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
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'CheckIfDoesExist (Market)';
        }
        LogsService.Create(error);
        throw `Erro ao buscar a lista de ${this.path}. ${error.message}`;
      });
  }

  async CheckIfDoesExist(cnpj: string): Promise<Market> {
    // TO DO - Alterar após unificação
    const field = process.env.NODE_ENV === 'development' ? 'cnpj' : 'CNPJ';
    const reference = query(
      collection(database, this.path),
      where(field, '==', cnpj)
    );

    try {
      const snapshot = await getDocs(reference);
      if (snapshot.empty) {
        return EmptyMarket;
      }

      const object = snapshot.docs[0];
      const receipt = object.data();

      return {
        id: object.id,
        ...receipt,
      } as Market;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'CheckIfDoesExist (Market)';
      }
      LogsService.Create(error);
      throw `Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message ?? error}`;
    }
  }
}

export const MarketRepository = new MarketRepositoryImplements();

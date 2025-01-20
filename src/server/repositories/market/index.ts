import { FirebaseError } from 'firebase/app';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { Market } from '@/server/entities/market';
import { LogsService } from '@/server/services/logs';

class MarketRepositoryImplements {
  private path;
  private fieldMarket;
  private emptyMarket: Market;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'mercadoDev' : 'mercado';
    this.fieldMarket = process.env.NODE_ENV === 'development' ? 'cnpj' : 'CNPJ'; // TO DO - Alterar após unificação
    this.emptyMarket = {
      nomeFantasia: '',
      razaoSocial: '',
      cnpj: '',
      cep: '',
      cidade: '',
      uf: '',
      endereco: '',
      numero: '',
      bairro: '',
      dataInclusao: 0,
      dataAtualizacao: 0,
    };
  }

  async GetAll(
    order: 'nomeFantasia' | 'cnpj' = 'nomeFantasia'
  ): Promise<Array<Market>> {
    const reference = query(collection(database, this.path), orderBy(order));

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();

          return {
            id: doc.id,
            ...object,
          };
        }) as Array<Market>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'GetAll (Market)';
        }
        LogsService.Create(error);
        throw `Erro ao buscar a lista de mercados. ${error.message ?? error}`;
      });
  }

  async CheckIfDoesExist(cnpj: string): Promise<Market> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldMarket, '==', cnpj)
    );

    try {
      const snapshot = await getDocs(reference);
      if (snapshot.empty) {
        return this.emptyMarket;
      }

      const object = snapshot.docs[0];
      const market = object.data();

      return {
        id: object.id,
        ...market,
      } as Market;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'CheckIfDoesExist (Market)';
      }
      LogsService.Create(error);
      throw `Erro ao verificar se o mercado já está cadastrado(a). ${error.message ?? error}`;
    }
  }
}

export const MarketRepository = new MarketRepositoryImplements();

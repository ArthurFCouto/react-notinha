import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { MarketEntity } from '@/server/entities/market';
import { LogsService } from '@/server/services/logs';

class MarketRepositoryImplements {
  private path;
  private emptyMarket: MarketEntity;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'mercadoDev' : 'mercado';
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

  //TO DO - Atualizar para trabalhar com limit
  async GetAll(
    order: 'nomeFantasia' | 'cnpj' = 'nomeFantasia'
  ): Promise<Array<MarketEntity>> {
    const reference = query(collection(database, this.path), orderBy(order));

    return await getDocs(reference)
      .then(
        (response) =>
          response.docs.map((doc) => doc.data()) as Array<MarketEntity>
      )
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'GetAll (Market)';
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de mercados.`;
      });
  }

  async CheckIfDoesExist(cnpj: string): Promise<MarketEntity> {
    const reference = doc(database, this.path, cnpj);

    try {
      const snapshot = await getDoc(reference);
      const object = snapshot.data();

      return object ? (object as MarketEntity) : this.emptyMarket;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - CheckIfDoesExist (Market)`;
      }
      LogsService.Create(error);
      throw `Ocorreu um erro enquanto vefiricávamos se o mercado já está cadastrado.`;
    }
  }
}

export const MarketRepository = new MarketRepositoryImplements();

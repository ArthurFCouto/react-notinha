import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getFirestore,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { MarketRepository } from '@/server/repository/market';
import { Market } from '@/server/models/market';

class MarketServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'mercado';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async Create(market: Market): Promise<Market> {
    const exist = await MarketRepository.CheckIfDoesExist(market.cnpj);
    if (exist.id) {
      market.id = exist.id;
      return this.Update(market);
    }

    delete market.id;
    return await addDoc(collection(this.database, this.path), market)
      .then((response) => {
        return {
          id: response.id,
          ...market,
        };
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message}`;
      });
  }

  async Update(market: Market): Promise<Market> {
    const reference = doc(this.database, this.path, market.id!);
    const newMarket = {
      nomeFantasia: market.nomeFantasia,
      razaoSocial: market.razaoSocial,
      cnpj: market.cnpj,
      cep: market.cep,
      cidade: market.cidade,
      uf: market.uf,
      endereco: market.endereco,
      numero: market.numero,
      bairro: market.bairro,
      dataAtualizacao: new Date().getTime(),
    };

    this.batch.update(reference, newMarket);
    await this.batch.commit().catch((error: FirebaseError) => {
      SharedService.CreateErrorLog(error);
      throw `Erro ao atualizar lista de preços. ${error.message}`;
    });

    return {
      id: market.id,
      dataInclusao: market.dataInclusao,
      ...newMarket,
    };
  }
}

export const MarketService = new MarketServiceImplements();

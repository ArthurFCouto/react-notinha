import { FirebaseError } from 'firebase/app';
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { MarketRepository } from '@/server/repository/market';
import { Market } from '@/server/models/market';

class MarketServiceImplements {
  private batch;
  private path;

  constructor() {
    this.batch = writeBatch(database);
    this.path =
      process.env.NODE_ENV === 'development' ? 'mercadoDev' : 'mercado';
  }

  async Create(market: Market): Promise<Market> {
    const exist = await MarketRepository.CheckIfDoesExist(market.cnpj);
    if (exist.id) {
      market.id = exist.id;
      return market.dataAtualizacao > exist.dataAtualizacao
        ? this.Update(market)
        : exist;
    }

    delete market.id;
    return await addDoc(collection(database, this.path), market)
      .then((response) => {
        return {
          id: response.id,
          ...market,
        };
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `Create ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message ?? error}`;
      });
  }

  async Update(market: Market): Promise<Market> {
    const reference = doc(database, this.path, market.id!);
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
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Update ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao atualizar ${this.path}. ${error.message ?? error}`;
    });

    return {
      id: market.id,
      dataInclusao: market.dataInclusao,
      ...newMarket,
    };
  }
}

export const MarketService = new MarketServiceImplements();

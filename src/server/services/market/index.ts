import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { MarketRepository } from '@/server/repositories/market';
import { Market } from '@/server/entities/market';

class MarketServiceImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'mercadoDev' : 'mercado';
  }

  async Create(market: Market): Promise<Market> {
    const exist = await MarketRepository.CheckIfDoesExist(market.cnpj);
    if (exist.cnpj.length != 0) {
      market.dataInclusao = exist.dataInclusao;

      return market.dataAtualizacao > exist.dataAtualizacao
        ? this.Update(market)
        : exist;
    }

    const reference = doc(database, this.path, market.cnpj);
    await setDoc(reference, market).catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Create (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível realizar o cadastro do mercado. [${market.cnpj}]`;
    });

    return market;
  }

  // TO DO - Adicionar limite de itens no commit, são permitidas 500 operações por vez
  async DeleteList(markets: Market[]): Promise<void> {
    if (markets.length == 0) return;

    const batch = writeBatch(database);
    const cnpjs = markets.map((market) => market.cnpj);

    cnpjs.forEach((cnpj) => {
      batch.delete(doc(collection(database, this.path), cnpj));
    });

    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível completar a exclusão de mercados por cnpj.`;
    }
  }

  async Update(market: Market): Promise<Market> {
    const batch = writeBatch(database);
    const reference = doc(database, this.path, market.cnpj);
    const newMarket = {
      nomeFantasia: market.nomeFantasia,
      razaoSocial: market.razaoSocial,
      cep: market.cep,
      cidade: market.cidade,
      uf: market.uf,
      endereco: market.endereco,
      numero: market.numero,
      bairro: market.bairro,
      dataAtualizacao: new Date().getTime(),
    };

    batch.update(reference, newMarket);
    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Update (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir a atualização do mercado [${market.cnpj}]`;
    }

    return {
      cnpj: market.cnpj,
      dataInclusao: market.dataInclusao,
      ...newMarket,
    };
  }
}

export const MarketService = new MarketServiceImplements();

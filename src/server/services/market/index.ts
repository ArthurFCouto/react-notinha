import { FirebaseError } from 'firebase/app';
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
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
          error.stack = error.stack ?? `Create (${this.path})`;
        }
        LogsService.Create(error);
        throw `Não foi possível realizar o cadastro do mercado. ${error.message ?? error}`;
      });
  }

  // TO DO - Adicionar limite de itens no commit, são permitidas 500 operações por vez
  async DeleteList(markets: Market[]): Promise<void> {
    if (markets.length == 0) return;

    const batch = writeBatch(database);
    const ids = markets.map((market) => market.id);

    ids.forEach((id) => {
      batch.delete(doc(collection(database, this.path), id));
    });

    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível completar a exclusão de mercados por id. ${error.message ?? error}`;
    }
  }

  async Update(market: Market): Promise<Market> {
    const batch = writeBatch(database);
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

    batch.update(reference, newMarket);
    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Update (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir a atualização do mercado. ${error.message ?? error}`;
    }

    return {
      id: market.id,
      dataInclusao: market.dataInclusao,
      ...newMarket,
    };
  }
}

export const MarketService = new MarketServiceImplements();

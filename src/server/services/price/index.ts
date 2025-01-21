import { collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Price } from '@/server/entities/price';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistory } from '@/server/entities/priceHistory';
import { PriceHistoryService } from '../priceHistory';

class PriceServiceImplements {
  private path;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
  }

  // TO DO - Adicionar limite de itens no commit, são permitidas 500 operações por vez
  async CreateList(prices: Price[]): Promise<void> {
    if (prices.length === 0) return;

    const batch = writeBatch(database);
    const savedPrices = await PriceRepository.GetAll();

    const pricesToBeUpdated: Price[] = [];
    const pricesToGoToHistoric: PriceHistory[] = [];

    const keysDataSavedPrices = savedPrices.map(
      (price) => `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`
    );

    prices.forEach((price) => {
      const keyData = `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`;
      if (keysDataSavedPrices.includes(keyData)) return;

      const savedPrice = savedPrices.find(
        (actualPrice) =>
          actualPrice.nomeProduto == price.nomeProduto &&
          actualPrice.idMercado == price.idMercado
      );
      if (!savedPrice) {
        delete price.id;
        const reference = doc(collection(database, this.path));
        batch.set(reference, price);
        return;
      }

      if (savedPrice!.dataInclusao < price.dataInclusao) {
        price.id = savedPrice!.id;
        pricesToGoToHistoric.push(this.MappingPriceToPriceHistory(savedPrice));
        pricesToBeUpdated.push(this.MappingPriceToUpdate(price));
        return;
      }

      pricesToGoToHistoric.push(this.MappingPriceToPriceHistory(price));
    });

    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CreateList (${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir o cadastro da lista de produtos. ${error.message ?? error}`;
    }

    await this.UpdateList(pricesToBeUpdated);
    await PriceHistoryService.CreateList(pricesToGoToHistoric);
  }

  // TO DO - Adicionar limite de itens no commit, são permitidas 500 operações por vez
  async DeleteList(prices: Price[]): Promise<void> {
    if (prices.length == 0) return;

    const pricesWhitoutId = prices.filter((price) => !price.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a exclusão pois, todos os preços da lista devem possuir a propriedade ID, confira os itens ${pricesWhitoutId.map((prices) => prices.nomeProduto).join(' ')}.`;
    }

    const batch = writeBatch(database);
    prices.forEach((price) => {
      batch.delete(doc(collection(database, this.path), price.id));
    });

    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete ${this.path}`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir a exclusão da lista de produtos. ${error.message ?? error}`;
    }
  }

  // TO DO - Adicionar limite de itens no commit, são permitidas 500 operações por vez
  async UpdateList(prices: Price[]): Promise<void> {
    if (prices.length == 0) return;

    const pricesWhitoutId = prices.filter((price) => !price.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a atualização pois, todos os preços da lista devem possuir a propriedade ID, confira os itens ${pricesWhitoutId.map((prices) => prices.nomeProduto).join(' ')}.`;
    }

    const batch = writeBatch(database);
    prices.forEach((price) => {
      const reference = doc(collection(database, this.path), price.id);
      batch.update(reference, price);
    });

    try {
      await batch.commit();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `(Update ${this.path})`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir a atualização da lista de produtos. ${error.message ?? error}`;
    }
  }

  private MappingPriceToPriceHistory = (price: Price): PriceHistory => {
    return {
      idPreco: price.id!,
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      dataInclusao: price.dataInclusao,
    };
  };

  private MappingPriceToUpdate = (price: Price): Price => {
    return {
      id: price.id,
      nomeProduto: price.nomeProduto,
      nomeMercado: price.nomeMercado,
      unidadeMedida: price.unidadeMedida,
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      possuiHistorico: true,
      dataInclusao: price.dataInclusao,
    };
  };
}

export const PriceService = new PriceServiceImplements();

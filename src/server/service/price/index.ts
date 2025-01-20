import { collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Price } from '@/server/models/price';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceHistoryService } from '../priceHistory';
import { FirebaseError } from 'firebase/app';

class PriceServiceImplements {
  private path;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
  }

  async CreateList(prices: Price[]): Promise<void> {
    if (prices.length === 0) return;

    const batch = writeBatch(database);

    const savedPrices = await PriceRepository.GetAll();

    const pricesToBeUpdated: Price[] = [];
    const pricesToGoToHistoric: PriceHistory[] = [];

    const keysDataSavedPrices = savedPrices.map(
      (price) => `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`
    );
    const keysMarketSavedPrices = savedPrices.map(
      (price) => `${price.nomeProduto}_${price.idMercado}`
    );

    prices.forEach((price) => {
      const keyData = `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`;
      if (keysDataSavedPrices.includes(keyData)) return;

      const keyMarket = `${price.nomeProduto}_${price.idMercado}`;
      if (!keysMarketSavedPrices.includes(keyMarket)) {
        delete price.id;
        const reference = doc(collection(database, this.path));
        batch.set(reference, price);
        return;
      }

      const savedPrice = savedPrices.find(
        (actualPrice) =>
          actualPrice.nomeProduto == price.nomeProduto &&
          actualPrice.idMercado == price.idMercado
      );
      if (savedPrice!.dataInclusao < price.dataInclusao) {
        price.id = savedPrice!.id;
        pricesToGoToHistoric.push(this.priceMapping(savedPrice!));
        pricesToBeUpdated.push(this.priceToUpdateMapping(price));
        return;
      }

      pricesToGoToHistoric.push(this.priceMapping(price));
    });

    this.UpdateList(pricesToBeUpdated);

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CreateList ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao cadastrar lista de ${this.path}. ${error.message ?? error}`;
    });

    await PriceHistoryService.CreateList(pricesToGoToHistoric);
  }

  async DeleteList(prices: Price[]): Promise<void> {
    if (prices.length == 0) return;

    const batch = writeBatch(database);

    const ids = prices.map((price) => price.id);

    ids.forEach((id) => {
      batch.delete(doc(collection(database, this.path), id));
    });

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao deletar lista de ${this.path}. ${error.message ?? error}`;
    });
  }

  private async UpdateList(prices: Price[]): Promise<void> {
    if (prices.length == 0) return;

    const batch = writeBatch(database);

    prices.forEach((price) => {
      const reference = doc(collection(database, this.path), price.id);
      batch.update(reference, {
        valor: price.valor,
        idNotaFiscal: price.idNotaFiscal,
        dataInclusao: price.dataInclusao,
      });
    });

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Update ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao atualizar lista de ${this.path}. ${error.message ?? error}`;
    });
  }

  private priceMapping = (price: Price): PriceHistory => {
    return {
      idPreco: String(price.id),
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      dataInclusao: price.dataInclusao,
    };
  };

  private priceToUpdateMapping = (price: Price): Price => {
    return {
      id: price.id,
      nomeProduto: price.nomeProduto,
      nomeMercado: price.nomeMercado,
      unidadeMedida: price.unidadeMedida,
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      dataInclusao: price.dataInclusao,
    };
  };
}

export const PriceService = new PriceServiceImplements();

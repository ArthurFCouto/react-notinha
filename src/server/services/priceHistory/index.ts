import { FirebaseError } from 'firebase/app';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { PriceHistory } from '@/server/entities/priceHistory';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';

class PriceHistoryImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
  }

  // TO DO - Prepara o método para caso seja necessário cadastrar uma lista para mercados e datas diferentes
  async CreateList(prices: PriceHistory[]): Promise<void> {
    if (prices.length == 0) return;

    const batch = writeBatch(database);

    const createKey = (price: PriceHistory) =>
      `${price.idMercado}_${price.dataInclusao}_${price.idPreco}`;
    const idMercado = prices[0].idMercado;
    const dataInclusao = prices[0].dataInclusao;
    const savedPrices = await PriceHistoryRepository.GetListByMarket(
      idMercado,
      dataInclusao
    );
    const keysSavedPrices = savedPrices.map((price) => createKey(price));

    prices.forEach((price) => {
      if (keysSavedPrices.includes(createKey(price))) return;

      delete price.id;
      const reference = doc(collection(database, this.path));
      batch.set(reference, price);
    });

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CreateList ${this.path}`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir o cadastro da lista com o histórico de preço dos produtos. ${error.message ?? error}`;
    });
  }

  async DeleteList(prices: PriceHistory[]): Promise<void> {
    if (prices.length == 0) return;

    const pricesWhitoutId = prices.filter((price) => !price.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a exclusão pois, todos os preços da lista devem possuir a propriedade ID, confira novamente a lista enviada.`;
    }

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
      throw `Não foi possível concluir a exclusão da lista de histórico de preços dos produtos. ${error.message ?? error}`;
    });
  }
}

export const PriceHistoryService = new PriceHistoryImplements();

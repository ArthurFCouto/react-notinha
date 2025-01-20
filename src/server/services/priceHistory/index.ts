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

  async CreateList(prices: PriceHistory[]): Promise<void> {
    if (prices.length == 0) return;

    const batch = writeBatch(database);

    const idMercado = prices[0].idMercado;
    const dataInclusao = prices[0].dataInclusao;
    const savedPrices = await PriceHistoryRepository.GetListByMarket(
      idMercado,
      dataInclusao
    );
    const keysSavedPrices = savedPrices.map(
      (price) => `${price.idMercado}_${price.dataInclusao}_${price.idPreco}`
    );

    prices.forEach((price) => {
      if (
        keysSavedPrices.includes(
          `${price.idMercado}_${price.dataInclusao}_${price.idPreco}`
        )
      )
        return;

      delete price.id;
      const reference = doc(collection(database, this.path));
      batch.set(reference, price);
    });

    await batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CreateList ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao cadastrar histórico de ${this.path}. ${error.message ?? error}`;
    });
  }

  async DeleteList(prices: PriceHistory[]): Promise<void> {
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
}

export const PriceHistoryService = new PriceHistoryImplements();

import { FirebaseError } from 'firebase/app';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceHistoryRepository } from '@/server/repository/priceHistory';

class PriceHistoryImplements {
  private batch;
  private path;

  constructor() {
    this.batch = writeBatch(database);
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
  }

  async CreateList(prices: PriceHistory[]): Promise<void> {
    if (prices.length == 0) return;

    const idMercado = prices[0].idMercado;
    const dataInclusao = prices[0].dataInclusao;
    const savedPrices = await PriceHistoryRepository.GetAllByMarket(
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
      this.batch.set(reference, price);
    });

    await this.batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CreateList ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao cadastrar histórico de ${this.path}. ${error.message ?? error}`;
    });
  }

  async DeleteList(prices: PriceHistory[]): Promise<void> {
    if (prices.length == 0) return;

    const ids = prices.map((price) => price.id);

    ids.forEach((id) => {
      this.batch.delete(doc(collection(database, this.path), id));
    });

    await this.batch.commit().catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Delete ${this.path}`;
      }
      LogsService.Create(error);
      throw `Erro ao deletar lista de ${this.path}. ${error.message ?? error}`;
    });
  }
}

export const PriceHistoryService = new PriceHistoryImplements();

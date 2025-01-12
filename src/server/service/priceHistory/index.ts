import { FirebaseError } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceHistoryRepository } from '@/server/repository/priceHistory';

class PriceHistoryImplements {
  private batch;
  private database;
  private path = 'historicoDePrecos';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CreateList(prices: PriceHistory[]): Promise<void> {
    if (prices.length === 0) return;

    const idMercado = prices[0].id!;
    const dataInclusao = prices[0].dataInclusao;
    const listHistoryPrices = await PriceHistoryRepository.GetAllByMarket(
      idMercado,
      dataInclusao
    );
    const keysHistoryPrices = listHistoryPrices.map(
      (price) => `${price.idMercado}_${price.dataInclusao}`
    );

    prices.forEach((price) => {
      if (
        keysHistoryPrices.includes(`${price.idMercado}_${price.dataInclusao}`)
      )
        return;

      delete price.id;
      const reference = doc(collection(this.database, this.path));
      this.batch.set(reference, price);
    });

    return await this.batch.commit().catch((error: FirebaseError) => {
      LogsService.Create(error);
      throw `Erro ao cadastrar histórico de preços. ${error.message}`;
    });
  }
}

export const PriceHistoryService = new PriceHistoryImplements();

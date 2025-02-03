import { collection, doc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { PriceHistoryEntity } from '@/server/entities/priceHistory';

class PriceHistoryImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
  }

  async DeleteList(prices: PriceHistoryEntity[]): Promise<void> {
    if (prices.length == 0) return;

    const pricesWhitoutId = prices.filter((price) => !price.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a exclusão pois, todos os preços da lista de histórico devem possuir a propriedade ID, confira novamente a lista enviada.`;
    }

    const chunks = this.ChunkArray(prices, 250);

    for (const chunk of chunks) {
      const batch = writeBatch(database);
      chunk.forEach((price) => {
        batch.delete(doc(collection(database, this.path), price.id!));
      });

      await batch.commit().catch((error: any) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - Delete (${this.path})`;
        }
        LogsService.Create(error);
        throw `Não foi possível concluir a exclusão da lista de histórico de preços dos produtos.`;
      });
    }
  }

  private ChunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}

export const PriceHistoryService = new PriceHistoryImplements();

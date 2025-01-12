import { FirebaseError } from 'firebase/app';
import { collection, doc, getFirestore, writeBatch } from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { Price } from '@/server/models/price';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceHistoryService } from '../priceHistory';

class PriceServiceImplements {
  private batch;
  private database;
  private path = 'precos';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CreateList(prices: Price[]): Promise<void> {
    if (prices.length === 0) return;

    const pricesToBeUpdated: Price[] = [];
    const historyPrices: PriceHistory[] = [];
    const actualPrices = await PriceRepository.GetAll();

    const keysDataActualPrices = actualPrices.map(
      (price) => `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`
    );
    const keysMarketActualPrices = actualPrices.map(
      (price) => `${price.nomeProduto}_${price.idMercado}`
    );

    prices.forEach((price) => {
      const keyData = `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`;
      if (keysDataActualPrices.includes(keyData)) return;

      const keyMarket = `${price.nomeProduto}_${price.idMercado}`;
      if (keysMarketActualPrices.includes(keyMarket)) {
        const priceAtual = actualPrices.find(
          (actualPrice) =>
            actualPrice.nomeProduto == price.nomeProduto &&
            actualPrice.idMercado == price.idMercado
        );
        if (priceAtual!.dataInclusao < price.dataInclusao) {
          historyPrices.push(this.CreateHistoryPriceObject(priceAtual!));
          pricesToBeUpdated.push(this.CreatePriceToBeUpdated(price));
        } else {
          historyPrices.push(this.CreateHistoryPriceObject(price));
          pricesToBeUpdated.push(this.CreatePriceToBeUpdated(priceAtual!));
        }
        return;
      }

      delete price.id;
      const reference = doc(collection(this.database, this.path));
      this.batch.set(reference, price);
    });

    await this.batch.commit().catch((error: FirebaseError) => {
      LogsService.Create(error);
      throw `Erro ao cadastrar lista de preços. ${error.message}`;
    });

    await Promise.all([
      this.UpdateList(pricesToBeUpdated),
      PriceHistoryService.CreateList(historyPrices),
    ]);
  }

  async UpdateList(prices: Price[]): Promise<void> {
    prices.forEach((price) => {
      const reference = doc(this.database, this.path, price.id!);
      this.batch.update(reference, {
        valor: price.valor,
        idNotaFiscal: price.idNotaFiscal,
        dataInclusao: price.dataInclusao,
      });
    });

    await this.batch.commit().catch((error: FirebaseError) => {
      LogsService.Create(error);
      throw `Erro ao atualizar lista de preços. ${error.message}`;
    });
  }

  private CreateHistoryPriceObject = (price: Price): PriceHistory => {
    return {
      idPreco: String(price.id),
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      dataInclusao: price.dataInclusao,
    };
  };

  private CreatePriceToBeUpdated = (price: Price): Price => {
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

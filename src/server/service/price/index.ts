import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  Firestore,
  getFirestore,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { Price } from '@/server/models/price';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistory } from '@/server/models/priceHistory';

interface PricesBaseModel extends Price {
  keyDate: string;
  keyMarket: string;
}

class PriceServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'precos';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }

  async CreateList(prices: Price[]) {
    const { dataInclusao } = prices[0];
    const pricesToBeUpdated: Price[] = [];
    const historyPrices: PriceHistory[] = [];
    const actualPrices: PricesBaseModel[] = await PriceRepository.GetAll().then(
      (prices) =>
        prices.map((price) => {
          return {
            keyDate: `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`,
            keyMarket: `${price.nomeProduto}_${price.idMercado}`,
            ...price,
          };
        })
    );
    const actualKeysDate = actualPrices.map((price) => price.keyDate);
    const actualKeysMarket = actualPrices.map((price) => price.keyMarket);

    prices.forEach((price) => {
      const keyDate = `${price.nomeProduto}_${price.idMercado}_${price.dataInclusao}`;
      const keyMarket = `${price.nomeProduto}_${price.idMercado}`;
      if (actualKeysDate.includes(keyDate)) return;

      if (actualKeysMarket.includes(keyMarket)) {
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

    // GRAVAR O HISTÒRICO DE PREÇOS, ATUALIZAR OS PREÇOS E SALVAR O PREÇO ATUAL

    list.forEach((price) => {
      const key = `${price.nomeProduto}_${price.idMercado}_${price.valor}`;
      if (PricesOfTheDay.includes(key)) return;

      delete price.id;
      const reference = doc(collection(this.database, this.path));
      this.batch.set(reference, price);
    });

    return await this.batch.commit().catch((error: FirebaseError) => {
      SharedService.CreateErrorLog(error);
      throw `Erro ao cadastrar lista de preços. ${error.message}`;
    });
  }

  private CreateHistoryPriceObject = (
    price: PricesBaseModel | Price
  ): PriceHistory => {
    return {
      idPreco: String(price.id),
      idMercado: price.idMercado,
      idNotaFiscal: price.idNotaFiscal,
      valor: price.valor,
      dataInclusao: price.dataInclusao,
    };
  };

  private CreatePriceToBeUpdated = (price: PricesBaseModel | Price): Price => {
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

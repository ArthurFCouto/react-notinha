import {
  collection,
  doc,
  runTransaction,
  writeBatch,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { GenereteIndexName, PriceEntity } from '@/server/entities/price';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryEntity } from '@/server/entities/priceHistory';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';

class PriceServiceImplements {
  private path;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'precosDev' : 'precos';
  }

  // TO DO - Reler e refatorar
  async CreateList(prices: Array<PriceEntity>): Promise<void> {
    if (prices.length === 0) return;

    const cnpj = prices[0].cnpjMercado;
    const savedPrices = await PriceRepository.GetListByMarketModel(cnpj);
    const historyMap: Record<string, Array<PriceHistoryEntity>> = {};

    for (const savedPrice of savedPrices) {
      if (
        savedPrice.possuiHistorico &&
        prices.some((p) => p.nomeProduto === savedPrice.nomeProduto)
      ) {
        const ref = doc(database, this.path, savedPrice.id!);
        const historySnapshot =
          await PriceHistoryRepository.GetListByReference(ref);
        historyMap[savedPrice.id!] = historySnapshot;
      }
    }

    const chunks = this.ChunkArray(prices, 250);

    for (const chunk of chunks) {
      await runTransaction(database, async (transaction) => {
        for (const price of chunk) {
          const existingPrice = savedPrices.find(
            (p) => p.nomeProduto == price.nomeProduto
          );

          if (existingPrice) {
            if (existingPrice.dataInclusao < price.dataInclusao) {
              const history = historyMap[existingPrice.id!] || [];
              const alreadyInHistory = history.some(
                (h) => h.mapValorData === existingPrice.mapValorData
              );

              if (!alreadyInHistory) {
                const historyRef = doc(
                  collection(
                    database,
                    this.path,
                    existingPrice.id!,
                    PriceHistoryRepository.path
                  )
                );
                transaction.set(
                  historyRef,
                  this.MappingPriceToPriceHistory(existingPrice)
                );
              }

              const priceRef = doc(database, this.path, existingPrice.id!);
              transaction.update(priceRef, this.MappingPriceToUpdate(price));
            } else {
              const history = historyMap[price.id!] || [];
              const alreadyInHistory = history.some(
                (h) => h.mapValorData == price.mapValorData
              );

              if (!alreadyInHistory) {
                const historyRef = doc(
                  collection(
                    database,
                    this.path,
                    existingPrice.id!,
                    PriceHistoryRepository.path
                  )
                );
                transaction.set(
                  historyRef,
                  this.MappingPriceToPriceHistory(price)
                );
              }
            }
          } else {
            const newPriceRef = doc(collection(database, this.path));
            transaction.set(newPriceRef, price);
          }
        }
      }).catch((error: any) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - CreateList (${this.path})`;
        }
        LogsService.Create(error);
        throw 'Não foi possível concluir o cadastro da lista de produtos.';
      });
    }
  }

  async DeleteList(prices: Array<PriceEntity>): Promise<void> {
    if (prices.length == 0) return;

    const pricesWhitoutId = prices.filter((price) => !price.id);
    if (pricesWhitoutId.length > 0) {
      throw `400 - Não foi possível concluir a exclusão pois, todos os preços da lista devem possuir a propriedade ID. Confira os itens ${pricesWhitoutId.map((prices) => prices.nomeProduto).join(' ')}.`;
    }

    const chunks = this.ChunkArray(prices, 250);

    for (const chunk of chunks) {
      const batch = writeBatch(database);
      chunk.forEach((price) => {
        batch.delete(doc(collection(database, this.path), price.id));
      });

      await batch.commit().catch((error: any) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - Delete (${this.path})`;
        }
        LogsService.Create(error);
        throw `Não foi possível concluir a exclusão da lista de produtos.`;
      });
    }
  }

  // TO DO - Reler e refatorar
  private ChunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  private MappingPriceToPriceHistory = (
    price: PriceEntity
  ): PriceHistoryEntity => {
    return {
      idPreco: price.id!,
      mapValorData: price.mapValorData,
      valor: price.valor,
      cnpjMercado: price.cnpjMercado,
      chaveNotaFiscal: price.chaveNotaFiscal,
      dataInclusao: price.dataInclusao,
    };
  };

  private MappingPriceToUpdate = (price: PriceEntity): PriceEntity => {
    return {
      mapValorData: price.mapValorData,
      mapProdutoMercado: price.mapProdutoMercado,
      mapProdutoMercadoData: price.mapProdutoMercadoData,
      nomeMercado: price.nomeMercado,
      nomeProduto: price.nomeProduto,
      indexNomeProduto: price.indexNomeProduto,
      unidadeMedida: price.unidadeMedida,
      valor: price.valor,
      cnpjMercado: price.cnpjMercado,
      chaveNotaFiscal: price.chaveNotaFiscal,
      possuiHistorico: true,
      dataInclusao: price.dataInclusao,
    };
  };
}

export const PriceService = new PriceServiceImplements();

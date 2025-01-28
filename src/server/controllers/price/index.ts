import { Price } from '@/server/entities/price';
import { PriceHistory } from '@/server/entities/priceHistory';
import RecordSet from '@/server/models/RecordSet';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';

class PriceControllerImplements {
  async GetAll(page: number, amountByPage: number): Promise<RecordSet<Price>> {
    const offset = (page - 1) * amountByPage;
    //const prices = await PriceRepository.GetAll(offset, amountByPage);
    const prices = await PriceRepository.GetAll();
    const amount = await PriceRepository.GetTotalAmount({});

    const response = {
      totalDeRegistros: amount,
      pagina: page,
      quantidadePorPagina: amount, // amountByPage,
      resultados: prices,
    };

    return RecordSet.Mapping<Price>(response);
  }

  async GetByNameAndMarket(
    product: string,
    marketId: string,
    page: number,
    amountByPage: number
  ): Promise<RecordSet<Price>> {
    const offset = (page - 1) * amountByPage;
    //const prices = await PriceRepository.GetListByNameAndMarket(product, marketId, offset, amountByPage);
    const prices = await PriceRepository.GetListByNameAndMarket(
      product,
      marketId
    );
    const amount = await PriceRepository.GetTotalAmount({ marketId, product });

    const response = {
      totalDeRegistros: amount,
      pagina: page,
      quantidadePorPagina: amount, // amountByPage,
      resultados: prices,
    };

    return RecordSet.Mapping<Price>(response);
  }

  async GetByName(
    product: string,
    page: number,
    amountByPage: number
  ): Promise<RecordSet<Price>> {
    const offset = (page - 1) * amountByPage;
    //const prices = await PriceRepository.GetListByName(product, offset, amountByPage);
    const prices = await PriceRepository.GetListByName(product);
    const amount = await PriceRepository.GetTotalAmount({ product });

    const response = {
      totalDeRegistros: amount,
      pagina: page,
      quantidadePorPagina: amount, // amountByPage,
      resultados: prices,
    };

    return RecordSet.Mapping<Price>(response);
  }

  async GetByMarket(
    marketId: string,
    page: number,
    amountByPage: number
  ): Promise<RecordSet<Price>> {
    const offset = (page - 1) * amountByPage;
    //const prices = await PriceRepository.GetListByMarket(marketId, offset, amountByPage);
    const prices = await PriceRepository.GetListByMarket(marketId);
    const amount = await PriceRepository.GetTotalAmount({ marketId });

    const response = {
      totalDeRegistros: amount,
      pagina: page,
      quantidadePorPagina: amount, // amountByPage,
      resultados: prices,
    };

    return RecordSet.Mapping<Price>(response);
  }

  async GetOnlyWithHistory(
    page: number,
    amountByPage: number
  ): Promise<RecordSet<Price>> {
    const offset = (page - 1) * amountByPage;
    //const prices = await PriceRepository.GetOnlyWithHistoric(offset, amountByPage);
    const prices = await PriceRepository.GetOnlyWithHistoric();
    const amount = await PriceRepository.GetTotalAmount({
      onlyWithHistoric: true,
    });

    const response = {
      totalDeRegistros: amount,
      pagina: page,
      quantidadePorPagina: amount, // amountByPage,
      resultados: prices,
    };

    return RecordSet.Mapping<Price>(response);
  }

  async GetHistory(priceIds: Array<string>): Promise<RecordSet<PriceHistory>> {
    const pricesHistory =
      await PriceHistoryRepository.GetListByPriceIdList(priceIds);

    const response = {
      totalDeRegistros: pricesHistory.length,
      pagina: 1,
      quantidadePorPagina: pricesHistory.length,
      resultados: pricesHistory,
    };

    return RecordSet.Mapping<PriceHistory>(response);
  }

  async GetHistoryByIdPreco(priceId: string): Promise<RecordSet<PriceHistory>> {
    const pricesHistory =
      await PriceHistoryRepository.GetListByPriceId(priceId);
    const price = await PriceRepository.GetListByIdList([priceId]);

    const lastPrice = {
      idPreco: price[0].id!,
      idMercado: price[0].idMercado,
      idNotaFiscal: price[0].idNotaFiscal,
      valor: price[0].valor,
      dataInclusao: price[0].dataInclusao,
    };
    pricesHistory.push(lastPrice);

    const response = {
      totalDeRegistros: pricesHistory.length,
      pagina: 1,
      quantidadePorPagina: pricesHistory.length,
      resultados: pricesHistory,
    };

    return RecordSet.Mapping<PriceHistory>(response);
  }
}

export const PriceController = new PriceControllerImplements();

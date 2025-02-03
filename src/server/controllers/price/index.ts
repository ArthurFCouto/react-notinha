import { PriceEntity } from '@/server/entities/price';
import { PriceHistoryEntity } from '@/server/entities/priceHistory';
import RecordSet from '@/server/models/RecordSet';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';
import { PriceService } from '@/server/services/price';

class PriceControllerImplements {
  async GetAll(
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceEntity>> {
    const prices = await PriceRepository.GetAll(offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({});

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: prices,
    };

    return RecordSet.Mapping<PriceEntity>(response);
  }

  async GetByName(
    product: string,
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceEntity>> {
    const prices = await PriceRepository.GetListByName(
      product,
      offSet,
      perPage
    );
    const amount = await PriceRepository.GetTotalAmount({ product });

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: prices,
    };

    return RecordSet.Mapping<PriceEntity>(response);
  }

  async GetByMarket(
    cnpj: string,
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceEntity>> {
    const prices = await PriceRepository.GetListByMarket(cnpj, offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({ cnpjMarket: cnpj });

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: prices,
    };

    return RecordSet.Mapping<PriceEntity>(response);
  }

  async GetOnlyWithHistory(
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceEntity>> {
    const prices = await PriceRepository.GetOnlyWithHistoric(offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({
      onlyWithHistoric: true,
    });

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: prices,
    };

    return RecordSet.Mapping<PriceEntity>(response);
  }

  async GetHistoryByIdPreco(
    priceId: string
  ): Promise<RecordSet<PriceHistoryEntity>> {
    const pricesHistory = await PriceHistoryRepository.GetListByPriceIdList([
      priceId,
    ]);
    const price = await PriceRepository.GetListByIdList([priceId]);

    const lastPrice = {
      idPreco: price[0].id!,
      mapValorData: price[0].mapValorData,
      valor: price[0].valor,
      cnpjMercado: price[0].cnpjMercado,
      chaveNotaFiscal: price[0].chaveNotaFiscal,
      dataInclusao: price[0].dataInclusao,
    };

    pricesHistory.push(lastPrice);

    const response = {
      totalDeRegistros: pricesHistory.length,
      pagina: 1,
      quantidadePorPagina: pricesHistory.length,
      resultados: pricesHistory.sort(
        (prev, next) => prev.dataInclusao - next.dataInclusao
      ),
    };

    return RecordSet.Mapping<PriceHistoryEntity>(response);
  }
}

export const PriceController = new PriceControllerImplements();

import { PriceDto, PriceDtoMapping } from '@/server/models/dtos/price';
import {
  PriceHistoryDto,
  PriceHistoryDtoMapping,
} from '@/server/models/dtos/priceHistory';
import RecordSet from '@/server/models/RecordSet';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';

class PriceControllerImplements {
  async GetAll(offSet: string, perPage: number): Promise<RecordSet<PriceDto>> {
    const prices = await PriceRepository.GetAll(offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({});

    const pricesDto = prices.map((price) => PriceDtoMapping(price));
    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: pricesDto,
    };

    return RecordSet.Mapping<PriceDto>(response);
  }

  async GetByName(
    product: string,
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceDto>> {
    const prices = await PriceRepository.GetListByName(
      product,
      offSet,
      perPage
    );
    const amount = await PriceRepository.GetTotalAmount({ product });

    const pricesDto = prices.map((price) => PriceDtoMapping(price));
    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: pricesDto,
    };

    return RecordSet.Mapping<PriceDto>(response);
  }

  async GetByMarket(
    cnpj: string,
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceDto>> {
    const prices = await PriceRepository.GetListByMarket(cnpj, offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({ cnpjMarket: cnpj });

    const pricesDto = prices.map((price) => PriceDtoMapping(price));
    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: pricesDto,
    };

    return RecordSet.Mapping<PriceDto>(response);
  }

  async GetOnlyWithHistory(
    offSet: string,
    perPage: number
  ): Promise<RecordSet<PriceDto>> {
    const prices = await PriceRepository.GetOnlyWithHistoric(offSet, perPage);
    const amount = await PriceRepository.GetTotalAmount({
      onlyWithHistoric: true,
    });

    const pricesDto = prices.map((price) => PriceDtoMapping(price));
    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: pricesDto,
    };

    return RecordSet.Mapping<PriceDto>(response);
  }

  async GetHistoryByIdPreco(
    priceId: string
  ): Promise<RecordSet<PriceHistoryDto>> {
    const pricesHistory = await PriceHistoryRepository.GetListByPriceIdList([
      priceId,
    ]);
    const price = await PriceRepository.GetById(priceId);

    const lastPrice = {
      idPreco: priceId,
      mapValorData: price.mapValorData,
      valor: price.valor,
      cnpjMercado: price.cnpjMercado,
      chaveNotaFiscal: price.chaveNotaFiscal,
      dataInclusao: price.dataInclusao,
    };

    pricesHistory.push(lastPrice);

    const pricesDto = pricesHistory
      .sort((prev, next) => prev.dataInclusao - next.dataInclusao)
      .map((price) => PriceHistoryDtoMapping(price));
    const response = {
      totalDeRegistros: pricesHistory.length,
      pagina: 1,
      quantidadePorPagina: pricesHistory.length,
      resultados: pricesDto,
    };

    return RecordSet.Mapping<PriceHistoryDto>(response);
  }
}

export const PriceController = new PriceControllerImplements();

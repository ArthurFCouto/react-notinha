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

    const pricesDto = pricesHistory.map((price) =>
      PriceHistoryDtoMapping(price)
    );
    const response = {
      totalDeRegistros: pricesHistory.length,
      pagina: 1,
      quantidadePorPagina: pricesHistory.length,
      resultados: pricesDto.sort(
        (prev, next) => prev.dataInclusao - next.dataInclusao
      ),
    };

    return RecordSet.Mapping<PriceHistoryDto>(response);
  }
}

export const PriceController = new PriceControllerImplements();

import { Price } from '@/server/models/price';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistoryRepository } from '@/server/repository/priceHistory';
import { PriceService } from '@/server/service/price';

class PriceControllerImprements {
  async GetAll(): Promise<Array<Price>> {
    return PriceRepository.GetAll();
  }

  async GetByNameAndMarket(
    name: string,
    idMarket: string
  ): Promise<Array<Price>> {
    return PriceRepository.GetListByNameAndMarket(name, idMarket);
  }

  async GetByName(name: string): Promise<Array<Price>> {
    return PriceRepository.GetListByName(name);
  }

  async GetByMarket(idMarket: string): Promise<Array<Price>> {
    return PriceRepository.GetListByMarket(idMarket);
  }

  async GetHistory(idPreco: Array<string>): Promise<Array<PriceHistory>> {
    return PriceHistoryRepository.GetListByListPriceId(idPreco);
  }

  async DeleteById(ids: Array<string>): Promise<void> {
    const prices = await PriceRepository.GetListById(ids);
    if (prices.length == 0)
      throw `401 - Não foram encontrados preços com os Ids informados, favor conferir. ${ids.join(';')}`;
    await PriceService.DeleteList(prices);
  }

  async DeleteAll(): Promise<void> {
    const prices = await PriceRepository.GetAll();
    await PriceService.DeleteList(prices);
  }
}

export const PriceController = new PriceControllerImprements();

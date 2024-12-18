import { Price } from '@/server/models/price';
import { PriceHistory } from '@/server/models/priceHistory';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistoryRepository } from '@/server/repository/priceHistory';

class PriceControllerImprements {
  async GetAll(): Promise<Array<Price>> {
    return PriceRepository.GetAll();
  }

  async GetByNameAndMarket(
    name: string,
    idMarket: string
  ): Promise<Array<Price>> {
    return PriceRepository.GetAllByNameAndMarket(name, idMarket);
  }

  async GetByName(name: string): Promise<Array<Price>> {
    return PriceRepository.GetAllByName(name);
  }

  async GetByMarket(idMarket: string): Promise<Array<Price>> {
    return PriceRepository.GetAllByMarket(idMarket);
  }

  async GetHistory(idProduto: string): Promise<Array<PriceHistory>> {
    return PriceHistoryRepository.GetAllByProduto(idProduto);
  }
}

export const PriceController = new PriceControllerImprements();

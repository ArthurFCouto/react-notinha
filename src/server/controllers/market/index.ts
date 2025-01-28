import { Market } from '@/server/entities/market';
import RecordSet from '@/server/models/RecordSet';
import { MarketRepository } from '@/server/repositories/market';
import { MarketService } from '@/server/services/market';

class MarketControllerImplements {
  async CheckMarketDoesExist(cnpj: string) {
    const market = await MarketRepository.CheckIfDoesExist(cnpj);
    const exist = market.cnpj.length != 0;

    const response = {
      totalDeRegistros: exist ? 1 : 0,
      pagina: 1,
      quantidadePorPagina: exist ? 1 : 0,
      resultados: exist ? [market] : [],
    };

    return RecordSet.Mapping<Market>(response);
  }

  async CreateMarket(market: Market) {
    return await MarketService.Create(market);
  }
}

export const MarketController = new MarketControllerImplements();

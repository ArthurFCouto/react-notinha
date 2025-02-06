import { ReceiptDto, ReceiptDtoMapping } from '@/server/models/dtos/receipt';
import RecordSet from '@/server/models/RecordSet';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { PriceService } from '@/server/services/price';
import { PriceHistoryService } from '@/server/services/priceHistory';
import { ReceiptService } from '@/server/services/receipt';
import { SefazService } from '@/server/services/sefaz';

class ReceiptImplements {
  async CreateReceipt(url: string): Promise<RecordSet<ReceiptDto>> {
    const qrCode = url.split('?p=')[1];
    const document = await SefazService.CreateVirtualDocument(qrCode);
    const market = await SefazService.CreateMarket(document);
    const receipt = await SefazService.CreateReceipt(document, qrCode, market);
    const items = await SefazService.CreateItemList(document, market, receipt);

    const receiptDto = ReceiptDtoMapping(receipt);
    const response = {
      totalDeRegistros: items.length,
      pagina: 1,
      quantidadePorPagina: items.length,
      resultados: [receiptDto],
      mensagemDeSucesso: 'Nota fiscal cadastrada com sucesso.',
    };

    return RecordSet.Mapping<ReceiptDto>(response);
  }

  async GetAllReceipts(
    offSet: string,
    perPage: number
  ): Promise<RecordSet<string>> {
    const key =
      offSet.length > 0 ? offSet.split('?p=')[1].slice(0, 44) : offSet;
    const receipts = await ReceiptRepository.GetAll(key, perPage);
    const amount = await ReceiptRepository.GetTotalAmount();

    const receiptsDto = receipts.map((receipt) => ReceiptDtoMapping(receipt));
    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: perPage,
      resultados: receiptsDto.map((receipts) => receipts.url),
    };

    return RecordSet.Mapping<string>(response);
  }

  async DeleteListByKeyList(keys: Array<string>): Promise<RecordSet<string>> {
    if (keys.length > 30) {
      throw `400 - Não é possível buscar mais de 30 objetos por vez, reduza a quantidade de objetos pesquisados (${keys.length}).`;
    }

    const receipts = await ReceiptRepository.GetListByKeyList(keys);
    const receiptsKeys = receipts.map((receipt) => receipt.chave);
    const prices = await PriceRepository.GetListByReceiptKeys(keys);
    const priceIds = prices.map((price) => price.id!);
    const pricesHistory =
      await PriceHistoryRepository.GetListByPriceIdList(priceIds);
    await ReceiptService.DeleteList(receipts);
    await PriceService.DeleteList(prices);
    await PriceHistoryService.DeleteList(pricesHistory);

    const amount = prices.length + pricesHistory.length;
    const keysNotFound = keys.filter((key) => !receiptsKeys.includes(key));

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: amount,
      resultados: keysNotFound.length > 0 ? keysNotFound : [],
      mensagemDeSucesso:
        keysNotFound.length > 0
          ? undefined
          : 'Todas as notas fiscais foram excluidas com sucesso',
      mensagemDeErro:
        keysNotFound.length > 0
          ? 'As chaves retornadas não foram excluidas, favor conferir. As demais foram excluidas com sucesso.'
          : undefined,
    };

    return RecordSet.Mapping<string>(response);
  }
}

export const ReceiptController = new ReceiptImplements();

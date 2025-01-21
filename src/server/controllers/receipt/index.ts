import { Receipt } from '@/server/entities/receipt';
import RecordSet from '@/server/models/RecordSet';
import { PriceRepository } from '@/server/repositories/price';
import { PriceHistoryRepository } from '@/server/repositories/priceHistory';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { PriceService } from '@/server/services/price';
import { PriceHistoryService } from '@/server/services/priceHistory';
import { ReceiptService } from '@/server/services/receipt';
import { SefazService } from '@/server/services/sefaz';

class ReceiptImplements {
  async CreateReceipt(url: string): Promise<RecordSet<Receipt>> {
    const qrCode = url.split('?p=')[1];
    const document = await SefazService.CreateVirtualDocument(qrCode);
    const market = await SefazService.CreateMarket(document);
    const receipt = await SefazService.CreateReceipt(document, qrCode, market);
    const items = SefazService.CreateItemList(document, market, receipt);
    await PriceService.CreateList(items);
    const response = {
      totalDeRegistros: items.length,
      pagina: 1,
      quantidadePorPagina: items.length,
      resultados: [receipt],
      mensagemDeSucesso: 'Nota fiscal cadastrada com sucesso.',
    };

    return RecordSet.Mapping<Receipt>(response);
  }

  async GetAllReceipts(): Promise<RecordSet<Receipt>> {
    const receipts = await ReceiptRepository.GetAll();
    const amount = await ReceiptRepository.GetTotalAmount();

    const response = {
      totalDeRegistros: amount,
      pagina: 1,
      quantidadePorPagina: amount,
      resultados: receipts,
    };

    return RecordSet.Mapping<Receipt>(response);
  }

  // TO DO - Medida provisória para limitar a quantidade de ids no filtro de busca.
  async DeleteListByKeyList(keys: Array<string>): Promise<RecordSet<string>> {
    let keysNotFound: Array<string> = [];
    let amount: number = 0;

    for (const key of keys) {
      const receipts = await ReceiptRepository.GetListByKeyList([key]);
      if (receipts.length == 0) {
        keysNotFound.push(key);
        continue;
      }
      const receiptId = receipts[0].id!;
      const prices = await PriceRepository.GetListByReceiptIdList([receiptId]);
      const priceIds = prices.map((price) => price.id!);
      const pricesHistory =
        await PriceHistoryRepository.GetListByPriceIdList(priceIds);
      await ReceiptService.DeleteList(receipts);
      await PriceService.DeleteList(prices);
      await PriceHistoryService.DeleteList(pricesHistory);

      amount = amount + receipts.length + prices.length + pricesHistory.length;
    }

    /*
    const receipts = await ReceiptRepository.GetListByKeyList(keys);
    const receiptKeys = receipts.map((receipt) => receipt.chave);
    const receiptIds = receipts.map((receipt) => receipt.id!);
    const keysNotFound = keys.filter((key) => !receiptKeys.includes(key));
    const prices = await PriceRepository.GetListByReceiptIdList(receiptIds);
    const priceIds = prices.map((price) => price.id!);
    const pricesHistory =
      await PriceHistoryRepository.GetListByPriceIdList(priceIds);
    await ReceiptService.DeleteList(receipts);
    await PriceService.DeleteList(prices);
    await PriceHistoryService.DeleteList(pricesHistory);
    const amount = receipts.length + prices.length + pricesHistory.length;
    */

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

import { Receipt } from '@/server/models/receipt';
import { PriceRepository } from '@/server/repository/price';
import { PriceHistoryRepository } from '@/server/repository/priceHistory';
import { ReceiptRepository } from '@/server/repository/receipt';
import { PriceService } from '@/server/service/price';
import { PriceHistoryService } from '@/server/service/priceHistory';
import { ReceiptService } from '@/server/service/receipt';
import { SefazService } from '@/server/service/sefaz';

class ReceiptImplements {
  async CreateReceipt(url: string): Promise<string> {
    const qrCode = url.split('?p=')[1];
    const document = await SefazService.CreateVirtualDocument(qrCode);
    const market = await SefazService.CreateMarket(document);
    const receiptObject = await SefazService.CreateReceiptObject(
      document,
      qrCode,
      market
    );
    const receipt = await ReceiptService.Create(receiptObject);
    const items = SefazService.CreateItemList(document, market, receipt);
    await PriceService.CreateList(items);
    return receipt.id!;
  }

  async GetAllReceipt(): Promise<Array<Receipt>> {
    return await ReceiptRepository.GetAll();
  }

  async GetTotalAmount(): Promise<number> {
    return await ReceiptRepository.GetTotalAmount();
  }

  async DeleteListByKey(key: string): Promise<void> {
    const receipt = await ReceiptRepository.GetByKey(key);
    if (!receipt.id)
      throw `400 - Não foi encontrado cupom fiscal salvo com a chave informada, favor conferir. ${key}`;
    const prices = await PriceRepository.GetListByReceipt([receipt.id!]);
    const priceIds = prices.map((price) => price.id!);
    const pricesHistory =
      await PriceHistoryRepository.GetListByListPriceId(priceIds);
    await ReceiptService.DeleteList([receipt]);
    await PriceService.DeleteList(prices);
    await PriceHistoryService.DeleteList(pricesHistory);
  }
}

export const ReceiptController = new ReceiptImplements();

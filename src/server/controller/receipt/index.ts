import { Receipt } from '@/server/models/receipt';
import { ReceiptRepository } from '@/server/repository/receipt';
import { PriceService } from '@/server/service/price';
import { ReceiptService } from '@/server/service/receipt';
import { SefazService } from '@/server/service/sefaz';

class ReceiptImplements {
  async CreateReceipt(url: string): Promise<void> {
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
  }

  async GetAllReceipt(): Promise<Array<Receipt>> {
    return await ReceiptRepository.GetAll();
  }

  async GetTotalAmount(): Promise<number> {
    return await ReceiptRepository.GetTotalAmount();
  }
}

export const ReceiptController = new ReceiptImplements();

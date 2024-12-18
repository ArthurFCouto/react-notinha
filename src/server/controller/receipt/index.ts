import { PriceService } from '@/server/service/price';
import { ReceiptService } from '@/server/service/receipt';
import { SefazService } from '@/server/service/sefaz';
import { NextResponse } from 'next/server';

class ReceiptImplements {
  async CreateReceipt(url: string) {
    const document = await SefazService.CreateVirtualDocument(url);
    const market = await SefazService.CreateMarket(document);
    const receipt = await SefazService.CreateReceiptObject(
      document,
      url,
      market
    );
    const items = SefazService.CreateItemList(document, market, receipt);

    await ReceiptService.Create(receipt);
    await PriceService.CreateList(items);
  }
}

export const ReceiptController = new ReceiptImplements();

import { ReceiptRepository } from '@/server/repository/receipt';
import { SefazRepository } from '@/server/repository/sefaz';
import { PriceService } from '@/server/service/price';
import { ReceiptService } from '@/server/service/receipt';
import { SefazService } from '@/server/service/sefaz';

class ReceiptImplements {
  async CreateReceipt(url: string) {
    const document = await SefazService.CreateVirtualDocument(url);
    const receiptKey = SefazRepository.GetReceiptKey(document);
    const receiptDoesExist =
      await ReceiptRepository.CheckIfDoesExist(receiptKey);
    if (receiptDoesExist.id)
      throw `Erro ao cadastrar cupom fiscal. Este cupom já está cadastrado.`;

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

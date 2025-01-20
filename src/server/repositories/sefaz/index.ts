import { LogsService } from '@/server/services/logs';

class SefazRepositoryImplements {
  /**
   * Retorna a chave de acesso da Nota Fiscal (somente números)
   * É necessário que já tenha sido criado o virtualDocument.
   */
  GetReceiptKey(doc: Document) {
    try {
      const element = doc.getElementById('collapseTwo') as HTMLElement;
      const key = element.querySelector(
        'table tbody tr:first-of-type td'
      )?.textContent;

      return String(key).replace(/[^\d]/g, '').trim();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'GetReceiptKey (Sefaz)';
      }
      LogsService.Create(error);
      throw `${error.message}`;
    }
  }

  /**
   * Retorna o CNPJ do emissor da Nota Fiscal (somente números)
   * É necessário que já tenha sido criado o virtualDocument.
   */
  GetReceiptCNPJ(doc: Document) {
    try {
      const element = doc.querySelector('tbody tr:first-of-type td') as Element;
      const allText = String(element.textContent);
      const limiter = allText.indexOf(',');

      return allText.slice(0, limiter).replace(/[^\d]/g, '').trim();
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'GetReceiptCNPJ (Sefaz)';
      }
      LogsService.Create(error);
      throw `${error.message}`;
    }
  }
}

export const SefazRepository = new SefazRepositoryImplements();

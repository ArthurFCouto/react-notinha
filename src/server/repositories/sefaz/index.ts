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

      return String(key).trim().replace(/[^\d]/g, '');
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - GetReceiptKey (Sefaz)`;
      }
      LogsService.Create(error);
      throw 'Houve um erro enquanto analisávamos os dados do cupom fiscal. Tente novamente em instantes ou entre em contato com o suporte.';
    }
  }

  /**
   * Retorna o CNPJ do emissor da Nota Fiscal (somente números)
   * É necessário que já tenha sido criado o virtualDocument.
   */
  GetReceiptCNPJ(doc: Document) {
    try {
      const element = doc.querySelector('tbody tr:first-of-type td') as Element;
      const text = element.textContent!;
      const limiter = text.indexOf(',');

      return text.slice(0, limiter).trim().replace(/[^\d]/g, '');
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - GetReceiptCNPJ (Sefaz)`;
      }
      LogsService.Create(error);
      throw 'Houve um erro enquanto analisávamos os dados do cupom fiscal. Tente novamente em instantes ou entre em contato com o suporte.';
    }
  }
}

export const SefazRepository = new SefazRepositoryImplements();

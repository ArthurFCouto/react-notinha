import SharedRepository from '../../shared';

class SefazRepositoryImplements {
  /**
   * Retorna a chave de acesso da Nota Fiscal (somente números)
   */
  GetReceiptKey(doc: Document) {
    try {
      const element = doc.getElementById('collapseTwo') as HTMLElement;
      const key = element.querySelector(
        'table tbody tr:first-of-type td'
      )?.textContent;
      return String(key).replace(/[^\d]/g, '');
    } catch (error: any) {
      SharedRepository.CreateErrorLog(error);
      throw `Erro interno - ${error.message}`;
    }
  }

  /**
   * Retorna o CNPJ do emissor da Nota Fiscal (somente números)
   */
  GetReceiptCNPJ(doc: Document) {
    try {
      const element = doc.querySelector('tbody tr:first-of-type td') as Element;
      const allText = String(element.textContent);
      const limiter = allText.indexOf(',');
      return allText.slice(0, limiter).replace(/[^\d]/g, '');
    } catch (error: any) {
      SharedRepository.CreateErrorLog(error);
      throw `Erro interno - ${error.message}`;
    }
  }
}

export const SefazRepository = new SefazRepositoryImplements();

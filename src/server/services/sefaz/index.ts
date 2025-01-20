import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import { LogsService } from '../logs';
import { Market } from '@/server/entities/market';
import { SefazRepository } from '@/server/repositories/sefaz';
import { Receipt } from '@/server/entities/receipt';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { MarketService } from '../market';
import { Price } from '@/server/entities/price';
import { MarketRepository } from '@/server/repositories/market';

const mainActivity = {
  code: '47.11-3-02',
  text: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados',
};

interface PricesWork {
  [index: string]: Price;
}

class SefazServiceImplements {
  private dateNow = new Date();
  private url =
    'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=';

  constructor() {
    this.dateNow.setHours(0, 0, 0, 0);
  }
  /**
   * Verifica se a url informada é referente a uma NF de MG
   */
  private IsValidUrl(qrCode: string): boolean {
    const regex = /^\d{44}\|/;
    return regex.test(qrCode);
  }

  /**
   * Cria um document virtual para tratar os dados da página html da SEFAZ.
   */
  async CreateVirtualDocument(qrCode: string): Promise<Document> {
    if (!this.IsValidUrl(qrCode))
      throw `400 - Este QR Code não é válido para nosso sistema.`;

    const { JSDOM } = jsdom;
    return await axios
      .get(this.url + qrCode)
      .then((response) => {
        const { data } = response;
        const virtualDocument = new JSDOM(data);
        return virtualDocument.window.document;
      })
      .catch((error: AxiosError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'CreateVirtualDocument (Sefaz)';
        }
        LogsService.Create(error);
        throw `${error.message ?? error}`;
      });
  }

  /**
   * Cria o mercado no banco de dados e retorna o Id.
   * É necessário que já tenha sido criado o virtualDocument.
   */
  async CreateMarket(doc: Document): Promise<Market> {
    const cnpj = SefazRepository.GetReceiptCNPJ(doc);
    const exist = await MarketRepository.CheckIfDoesExist(cnpj);
    if (exist.id) return exist;

    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage =
      'CNPJ - Tempo de espera de resposta do servidor encerrado.';

    const market = await axios
      .get(`https://receitaws.com.br/v1/cnpj/${cnpj}`)
      .then((response) => {
        const { data } = response;
        // if (!data.atividade_principal.includes(mainActivity))
        // throw 'Este CUPOM FISCAL provavelmente não é de mercado.';

        return {
          nomeFantasia: data.fantasia,
          razaoSocial: data.nome,
          cnpj: cnpj,
          cep: data.cep,
          cidade: data.municipio,
          uf: data.uf,
          endereco: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          dataInclusao: this.GetIssueDate(doc),
          dataAtualizacao: this.GetIssueDate(doc),
        } as Market;
      })
      .catch((error: AxiosError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? 'CreateMarket (Sefaz)';
        }
        LogsService.Create(error);
        throw `${error.message ?? error}`;
      });

    return MarketService.Create(market);
  }

  /**
   * Cria o objeto referente a nota fiscal.
   * É necessário que já tenham sido criados o virtualDocument e o mercado.
   */
  async CreateReceiptObject(
    doc: Document,
    qrCode: string,
    market: Market
  ): Promise<Receipt> {
    if (!this.IsValidUrl(qrCode))
      throw `400 - Este QR Code não é válido para nosso sistema.`;

    const key = SefazRepository.GetReceiptKey(doc);
    const exist = await ReceiptRepository.CheckIfDoesExist(key);
    if (exist.id) throw '400 - Este cupom já está cadastrado.';

    try {
      const element = doc.getElementById('collapse4') as HTMLElement;
      const issueDate = this.GetIssueDate(doc);
      const tableTwo = element.querySelector('table:nth-child(10)') as Element;
      const lineTwo = tableTwo.querySelector('tbody tr') as Element;
      const column = lineTwo.querySelector('td');
      const totalPrice = String(column?.textContent);

      return {
        cnpj: market.cnpj,
        chave: key,
        url: this.url + qrCode,
        valorTotal: this.ConfigureNumber(totalPrice, 2),
        idUsuario: '',
        idMercado: market.id!,
        dataEmissao: issueDate,
        dataInclusao: this.dateNow.getTime(),
      };
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'CreateReceiptObject (Sefaz)';
      }
      LogsService.Create(error);
      throw `${error.message ?? error}`;
    }
  }

  /**
   * Retorna uma lista com os itens da Nota Fiscal (sem repetição).
   * É necessário que já tenham sido criados o virtualDocument, o mercado e a nota fiscal.
   */
  CreateItemList(doc: Document, market: Market, receipt: Receipt): Price[] {
    try {
      const items: PricesWork = {};
      const element = doc.querySelector('.table.table-striped') as Element;
      const lines = element.querySelectorAll('tbody tr');

      lines.forEach((line) => {
        const columnData: string[] = [];
        const columns = line.querySelectorAll('td');

        columns.forEach((column, index) => {
          if (index == 0) {
            columnData[index] = String(
              column.querySelector('h7')?.textContent?.trim()
            );
            return;
          }
          columnData[index] = String(column.textContent?.trim());
        });

        const amount = this.ConfigureNumber(columnData[1], 3);
        const totalPrice = this.ConfigureNumber(columnData[3], 2);
        const key = columnData[0];
        const price = (parseFloat(totalPrice) / parseFloat(amount)).toString();

        if (!items[key]) {
          items[key] = {
            nomeMercado: market.nomeFantasia,
            nomeProduto: columnData[0],
            unidadeMedida: columnData[2].slice(4),
            valor: this.ConfigureNumber(price, 4),
            idMercado: market.id!,
            idNotaFiscal: receipt.id!,
            dataInclusao: receipt.dataInclusao,
          };
        }
      });

      return Object.values(items);
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? 'CreateItemList (Sefaz)';
      }
      LogsService.Create(error);
      throw `${error.message ?? error}`;
    }
  }

  /**
   * Retorna a data de emissão do cumpom fiscal
   * @returns Uma string no formato 01/01/2000 23:59:59
   */
  private GetIssueDate(doc: Document): number {
    const element = doc.getElementById('collapse4') as HTMLElement;
    const table = element.querySelector('table:nth-child(8)') as Element;
    const line = table.querySelector('tbody tr') as Element;
    const columns = line.querySelectorAll('td');

    return this.GenerateTimestamp(String(columns[3].textContent));
  }

  /**
   * Recebe a data no formado informado no cumpom fiscal e retorna o timestamp da data na hora 00:00:00
   * @param date - Deve estar no formato 01/01/2000 23:59:59
   * @returns O timestamp da data no horário 00:00:00
   */
  private GenerateTimestamp(date: string): number {
    const currentDate = date.split('/');

    const newDate = new Date(
      `${currentDate[1]}/${currentDate[0]}/${currentDate[2]}`
    );
    newDate.setHours(0, 0, 0, 0);

    return newDate.getTime();
  }

  /**
   * Gera um número com casas decimais pré-definidas
   * @returns Uma string com o número com a quantidade de casas decimais informada
   */
  private ConfigureNumber(value: string, toFixed: number): string {
    let sanitized = value.replace(/[^\d.,]/g, '');

    if (sanitized.includes(',') && sanitized.includes('.')) {
      sanitized = sanitized.replace(/\./g, '');
      sanitized = sanitized.replace(',', '.');
    } else if (sanitized.includes(',')) {
      sanitized = sanitized.replace(',', '.');
    }

    return parseFloat(sanitized).toFixed(toFixed);
  }
}

export const SefazService = new SefazServiceImplements();

import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import SharedService from '../../shared';
import { Market } from '@/server/models/market';
import { SefazRepository } from '@/server/repository/sefaz';
import { MarketRepository } from '@/server/repository/market';
import { Receipt } from '@/server/models/receipt';
import { ReceiptRepository } from '@/server/repository/receipt';
import { MarketService } from '../market';
import { Price } from '@/server/models/price';

const mainActivity = {
  code: '47.11-3-02',
  text: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados',
};

interface PricesWork {
  [index: string]: Price;
}

class SefazServiceImplements {
  /**
   * Verifica se a url informada é referente a uma NF de MG
   */
  private IsValidUrl(url: string): boolean {
    const regex =
      /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
  }

  /**
   * Cria um document virtual para tratar os dados da página html da SEFAZ.
   * Faz-se necessário para acesar as outras funções.
   */
  async CreateVirtualDocument(url: string): Promise<Document> {
    if (!this.IsValidUrl(url))
      throw `Este QR Code não é válido para nosso sistema.`;

    const { JSDOM } = jsdom;
    return await axios
      .get(url)
      .then((response) => {
        const { data } = response;
        const virtualDocument = new JSDOM(data);
        return virtualDocument.window.document;
      })
      .catch((error: AxiosError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro interno - ${error.message}`;
      });
  }

  /**
   * Cria o mercado no banco de dados e retorna o Id.
   * É necessário que já tenha sido criado o virtualDocument.
   */
  async CreateMarket(doc: Document): Promise<Market> {
    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage =
      'CNPJ - Tempo de espera de resposta do servidor encerrado.';

    const cnpj = SefazRepository.GetReceiptCNPJ(doc);
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
          dataInclusao: new Date().getTime(),
          dataAtualizacao: new Date().getTime(),
        } as Market;
      })
      .catch((error: AxiosError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro interno - ${error.message}`;
      });

    return MarketService.Create(market);
  }

  /**
   * Cria o objeto referente a nota fiscal.
   * É necessário que já tenham sido criados o virtualDocument e o mercado.
   */
  async CreateReceiptObject(
    doc: Document,
    url: string,
    market: Market
  ): Promise<Receipt> {
    const key = SefazRepository.GetReceiptKey(doc);
    const exist = await ReceiptRepository.CheckIfDoesExist(key);
    if (exist) throw 'Este cupom já está cadastrado.';

    try {
      const element = doc.getElementById('collapse4') as HTMLElement;
      const table = element.querySelector('table:nth-child(8)') as Element;
      const line = table.querySelector('tbody tr') as Element;
      const columns = line.querySelectorAll('td');
      const issueDate = this.GenerateTimestamp(String(columns[3].textContent));
      const tableTwo = element.querySelector('table:nth-child(10)') as Element;
      const lineTwo = tableTwo.querySelector('tbody tr') as Element;
      const column = lineTwo.querySelector('td');
      const totalPrice = String(column?.textContent)
        .slice(3)
        .replace(/[^\d.,]/g, '')
        .replace('.', '')
        .replace(',', '.');

      return {
        cnpj: SefazRepository.GetReceiptCNPJ(doc),
        chave: SefazRepository.GetReceiptKey(doc),
        url,
        valorTotal: parseFloat(totalPrice),
        idUsuario: '',
        idMercado: market.id!,
        dataEmissao: issueDate,
        dataInclusao: new Date().getTime(),
      };
    } catch (error: any) {
      SharedService.CreateErrorLog(error);
      throw `Erro interno - ${error.message}`;
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

        const amount = parseFloat(
          columnData[1].replace(/[^\d.,]/g, '').replace('.', ',')
        ).toFixed(3);

        const totalPrice = parseFloat(
          columnData[3]
            .replace(/[^\d.,]/g, '')
            .replace('.', '')
            .replace(',', '.')
        ).toFixed(2);

        const key = columnData[0];

        if (!items[key]) {
          items[key] = {
            nomeMercado: market.nomeFantasia,
            nomeProduto: columnData[0],
            unidadeMedida: columnData[2].slice(4),
            valor: parseFloat(totalPrice) / parseFloat(amount),
            idMercado: market.id!,
            idNotaFiscal: receipt.id!,
            dataInclusao: receipt.dataInclusao,
          };
        }
      });
      return Object.values(items);
    } catch (error: any) {
      SharedService.CreateErrorLog(error);
      throw `Erro interno - ${error.message}`;
    }
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
}

export const SefazService = new SefazServiceImplements();

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
  CheckUrl(url: string): boolean {
    const regex =
      /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
  }

  /**
   * Cria um document virtual para tratar os dados da página da SEFAZ
   */
  async CreateVirtualDocument(url: string): Promise<Document> {
    if (!this.CheckUrl(url))
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

  async CreateMarketId(doc: Document): Promise<string> {
    const cnpj = SefazRepository.GetReceiptCNPJ(doc);
    const exist = await MarketRepository.CheckIfDoesExist(cnpj);
    if (exist.id) return exist.id;

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

  async CreateReceiptObject(doc: Document, url: string): Promise<Receipt> {
    const key = SefazRepository.GetReceiptKey(doc);
    const receipt = await ReceiptRepository.CheckIfDoesExist(key);
    if (receipt) throw 'Este cupom já está cadastrado.';

    try {
      const marketId = await this.CreateMarketId(doc);

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
        .replaceAll('.', '')
        .replace(',', '.');
      return {
        cnpj: SefazRepository.GetReceiptCNPJ(doc),
        chave: SefazRepository.GetReceiptKey(doc),
        url,
        valorTotal: parseFloat(totalPrice),
        idUsuario: '',
        idMercado: marketId,
        dataEmissao: issueDate,
        dataInclusao: new Date().getTime(),
      };
    } catch (error: any) {
      SharedService.CreateErrorLog(error);
      throw `Erro interno - ${error.message}`;
    }
  }

  /**
   * Retorna uma lista com os itens da Nota Fiscal (sem repetição)
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
          columnData[1].replace(/[^\d.,]/g, '').replace(',', '.')
        );
        const totalPrice = parseFloat(
          columnData[3].replace(/[^\d.,]/g, '').replace(',', '.')
        );
        const key = columnData[0];
        if (!items[key]) {
          items[key] = {
            nomeMercado: market.nomeFantasia,
            nomeProduto: columnData[0],
            unidadeMedida: columnData[2].slice(4),
            valor: totalPrice / amount,
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

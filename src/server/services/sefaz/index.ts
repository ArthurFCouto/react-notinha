import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import { LogsService } from '../logs';
import { MarketEntity } from '@/server/entities/market';
import { SefazRepository } from '@/server/repositories/sefaz';
import { ReceiptEntity } from '@/server/entities/receipt';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { MarketService } from '../market';
import { MarketRepository } from '@/server/repositories/market';
import { ReceiptService } from '../receipt';
import {
  GenerateDateMarketProductMap,
  GenerateDateValueMap,
  GenerateMarketProductMap,
  PriceEntity,
} from '@/server/entities/price';
import { PriceService } from '../price';

interface PricesWork {
  [index: string]: PriceEntity;
}

class SefazServiceImplements {
  private dateNow = new Date();
  private url;

  constructor() {
    this.dateNow.setHours(0, 0, 0, 0);
    this.url =
      'https://portalsped.fazenda.mg.gov.br/portalnfce/sistema/qrcode.xhtml?p=';
  }

  /**
   * Verifica se a url informada é referente a uma chave de NF
   */
  private IsValidUrl(qrCode: string): boolean {
    const regex = /^\d{44}\|/;
    return regex.test(qrCode);
  }

  /**
   * Cria um documento virtual (virtualDocument) para tratar os dados da página html da SEFAZ.
   * @param qrCode A parte da string que vem na url após o sinal de igualdade (https://...qrcode.xhtml?p=)
   */
  async CreateVirtualDocument(qrCode: string): Promise<Document> {
    if (!this.IsValidUrl(qrCode))
      throw '400 - Este QR Code não é válido para nosso sistema.';

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
          error.message = `${error.message} - CreateVirtualDocument (Sefaz)`;
        }
        LogsService.Create(error);
        throw 'Houve um erro enquanto buscávamos os dados do cupom fiscal. Tente novamente em instantes ou entre em contato com o suporte.';
      });
  }

  /**
   * Cria o mercado no banco de dados e o retorna.
   * É necessário que já tenha sido criado o virtualDocument.
   */
  async CreateMarket(doc: Document): Promise<MarketEntity> {
    const cnpj = SefazRepository.GetReceiptCNPJ(doc);
    const exist = await MarketRepository.CheckIfDoesExist(cnpj);
    if (exist.cnpj === cnpj) return exist;

    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage = `Não conseguimos validar o os dados do mercado (${cnpj}). Tente novamente em instantes ou entre em contato com o suporte.`;

    // TO DO Configurar para que sejam aceitos apenas cupons de mercado, ou começar a trabalhar com categorias

    const market = await axios
      .get(`https://receitaws.com.br/v1/cnpj/${cnpj}`)
      .then((response) => {
        const { data } = response;

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
        } as MarketEntity;
      })
      .catch((error: AxiosError) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - CreateMarket (Sefaz)`;
        }
        LogsService.Create(error);
        throw `Não conseguimos validar o os dados do mercado (${cnpj}). Tente novamente em instantes ou entre em contato com o suporte.`;
      });

    return MarketService.Create(market);
  }

  /**
   * Cria a nota fiscal no banco de dados e retorna o objeto com Id.
   * É necessário que já tenham sido criados o virtualDocument e o mercado.
   */
  async CreateReceipt(
    doc: Document,
    qrCode: string,
    market: MarketEntity
  ): Promise<ReceiptEntity> {
    if (!this.IsValidUrl(qrCode))
      throw '400 - Este QR Code não é válido para nosso sistema.';

    const key = SefazRepository.GetReceiptKey(doc);
    const exist = await ReceiptRepository.CheckIfDoesExist(key);
    if (exist.chave === key)
      throw `400 - Não foi possível concluir o cadastro da nota fiscal (${key}). Este cupom já está cadastrado.`;

    let receipt: ReceiptEntity;

    try {
      const element = doc.getElementById('collapse4') as HTMLElement;
      const tableTwo = element.querySelector('table:nth-child(10)') as Element;
      const lineTwo = tableTwo.querySelector('tbody tr') as Element;
      const column = lineTwo.querySelector('td');
      const totalPrice = String(column?.textContent);

      receipt = {
        cnpj: market.cnpj,
        chave: key,
        url: this.url + qrCode,
        valorTotal: this.ConfigureNumber(totalPrice, 2),
        idUsuario: String(process.env.NEXT_PUBLIC_USER_ID_DEFAULT),
        dataEmissao: this.GetIssueDate(doc),
        dataInclusao: this.dateNow.getTime(),
      };
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - CreateReceiptObject (Sefaz)`;
      }
      LogsService.Create(error);
      throw 'Houve um erro enquanto salvávamos os dados do cupom fiscal. Tente novamente em instantes ou entre em contato com o suporte.';
    }

    return ReceiptService.Create(receipt);
  }

  /**
   * Salva os itens da Nota Fiscal no banco de dados (sem repetição) e retorna a lista.
   * É necessário que já tenham sido criados o virtualDocument, o mercado e a nota fiscal.
   */
  async CreateItemList(
    doc: Document,
    market: MarketEntity,
    receipt: ReceiptEntity
  ): Promise<Array<PriceEntity>> {
    const items: PricesWork = {};

    try {
      const element = doc.querySelector('.table.table-striped') as Element;
      const lines = element.querySelectorAll('tbody tr');

      lines.forEach((line) => {
        const columnData: string[] = [];
        const columns = line.querySelectorAll('td');

        columns.forEach((column, index) => {
          if (index === 0) {
            columnData[index] = String(
              column.querySelector('h7')?.textContent?.trim()
            );
            return;
          }
          columnData[index] = String(column.textContent?.trim());
        });

        const key = columnData[0];

        if (!items[key]) {
          const amount = this.ConfigureNumber(columnData[1], 4);
          const totalPrice = this.ConfigureNumber(columnData[3], 4);
          const price = (
            parseFloat(totalPrice) / parseFloat(amount)
          ).toString();
          const value = this.ConfigureNumber(price, 4);

          items[key] = {
            mapValorData: GenerateDateValueMap(value, receipt.dataEmissao),
            mapProdutoMercado: GenerateMarketProductMap(
              columnData[0],
              market.cnpj
            ),
            mapProdutoMercadoData: GenerateDateMarketProductMap(
              columnData[0],
              receipt.dataEmissao,
              market.cnpj
            ),
            nomeMercado: market.nomeFantasia,
            nomeProduto: columnData[0],
            unidadeMedida: columnData[2].slice(4),
            valor: value,
            cnpjMercado: market.cnpj,
            chaveNotaFiscal: receipt.chave,
            possuiHistorico: false,
            dataInclusao: receipt.dataEmissao,
          };
        }
      });
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - CreateItemList (Sefaz)`;
      }
      LogsService.Create(error);
      throw 'Houve um erro enquanto salvávamos os dados do cupom fiscal. Tente novamente em instantes ou entre em contato com o suporte.';
    }

    const listItems = Object.values(items);
    await PriceService.CreateList(listItems);

    return listItems;
  }

  /**
   * Retorna o timestemp da data de emissão do cumpom fiscal
   * @returns O timestamp da data no horário 00:00:00
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
   * @param date - Deve estar no formato DD/MM/AAAA hh:mm:ss
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
   * Gera um número com a quantidade de casas decimais informadas
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

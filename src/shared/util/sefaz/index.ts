import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import { checkIfDocumentExist, createErrorLog, Invoice, Market, Price } from '@/shared/service/firebase';
import { ConvertStringToNumber, FormatDate } from '..';

interface PricesWork {
    [index: string]: Price
}

function CheckUrl(url: string) {
    const regex = /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
}

/**
  * Retorna a chave de acesso da Nota Fiscal (somente numeros)
  */
function getInvoiceKey(doc: Document) {
    try {
        const element = doc.getElementById('collapseTwo') as HTMLElement;
        const key = element.querySelector('table tbody tr:first-of-type td')?.textContent;
        return String(key).replace(/[^\d]/g, '');
    } catch (error: any) {
        createErrorLog(error);
        throw (`Erro interno - ${error.message}`);
    }
}

/**
  * Retorna os CNPJ do mercado emissor da Nota Fiscal (somente numeros)
  */
function getNumberCNPJ(doc: Document) {
    try {
        const element = doc.querySelector('tbody tr:first-of-type td') as Element;
        const allText = String(element.textContent);
        const limiter = allText.indexOf(',');
        return allText.slice(0, limiter).replace(/[^\d]/g, '');
    } catch (error: any) {
        createErrorLog(error);
        throw (`Erro interno - ${error.message}`);
    }
}

/**
  * Cria um document virtual para tratar os dados da página da SEFAZ
  */
export async function createVirtualDocument(url: string): Promise<Document> {
    if (!CheckUrl(url))
        throw (`Este QR Code não é válido para nosso sistema.`);
    const { JSDOM } = jsdom;
    return await axios.get(url)
        .then((response) => {
            const { data } = response;
            const virtualDocument = new JSDOM(data);
            return virtualDocument.window.document;
        })
        .catch((error: AxiosError) => {
            createErrorLog(error);
            throw (`Erro interno - ${error.message}`);
        });
}

export async function createMarket(doc: Document): Promise<Market> {
    const cnpj = getNumberCNPJ(doc);
    const market = await checkIfDocumentExist('mercado', cnpj);
    if (market)
        return market;

    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage = 'Dados do CNPJ - Tempo de espera de resposta do servidor encerrado.';

    return await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj.replace(/[^\d]/g, '')}`)
        .then((response) => {
            const { data } = response;
            return {
                CEP: data.cep,
                CNPJ: cnpj,
                UF: data.uf,
                bairro: data.bairro,
                cidade: data.municipio,
                endereco: data.logradouro,
                nomeFantasia: data.fantasia,
                numero: data.numero,
                razaoSocial: data.nome
            } as Market;
        })
        .catch((error: AxiosError) => {
            createErrorLog(error);
            throw (`Erro interno - ${error.message}`);
        });
};

export async function createInvoice(doc: Document, url: string): Promise<Invoice> {
    const key = getInvoiceKey(doc);
    const invoice = await checkIfDocumentExist('notaFiscal', key);
    if (invoice)
        throw ('Este cupom já está cadastrado.');
    try {
        const element = doc.getElementById('collapse4') as HTMLElement;
        const table = element.querySelector('table:nth-child(8)') as Element;
        const line = table.querySelector('tbody tr') as Element;
        const columns = line.querySelectorAll('td');
        const date = columns[3].textContent || FormatDate(new Date());
        const tableTwo = element.querySelector('table:nth-child(10)') as Element;
        const lineTwo = tableTwo.querySelector('tbody tr') as Element;
        const column = lineTwo.querySelector('td');
        const totalPrice = ConvertStringToNumber(String(column?.textContent)).toFixed(2);
        return {
            CNPJ: getNumberCNPJ(doc),
            chave: key,
            data: date.slice(0, 10),
            url,
            userID: null,
            valorTotal: totalPrice
        };
    } catch (error: any) {
        createErrorLog(error);
        throw (`Erro interno - ${error.message}`);
    }
}

/**
  * Retorna uma lista dos itens da Nota Fiscal (sem repetição)
  */
export function createListItems(doc: Document, market: Market, invoice: Invoice): Array<Price> {
    try {
        const element = doc.querySelector('.table.table-striped') as Element;
        const items: PricesWork = {};
        const lines = element.querySelectorAll('tbody tr');
        lines.forEach((line) => {
            const columnData: string[] = [];
            const columns = line.querySelectorAll('td');
            columns.forEach((column, index) => {
                if (index == 0) {
                    columnData[index] = String(column.querySelector('h7')?.textContent?.trim());
                    return;
                }
                columnData[index] = String(column.textContent?.trim());
            })
            const amount = ConvertStringToNumber(columnData[1]);
            const totalPrice = ConvertStringToNumber(columnData[3]);
            const key = columnData[0];
            if (!items[key]) {
                items[key] = {
                    data: invoice.data,
                    idMercado: market.id || '',
                    idNotaFiscal: invoice.id || '',
                    mercado: market.nomeFantasia,
                    produto: columnData[0],
                    unidadeMedida: columnData[2].slice(4),
                    valor: ConvertStringToNumber(String(totalPrice / amount)).toFixed(2),
                };
            }
        });
        return Object.values(items);
    } catch (error: any) {
        createErrorLog(error);
        throw (`Erro interno - ${error.message}`);
    }
}
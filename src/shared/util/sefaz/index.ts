import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import { Mercado, NotaFiscal, Precos, checkExistObject } from '@/shared/service/firebase';
import { ConvertStringToNumber, FormatDate } from '..';

interface PricesWork {
    [index: string]: Precos
}

/**
* Verifica se a URL é válida
*/
function checkURL(url: string) {
    const regex = /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
}

/**
 * Cria um document virtual para tratar os dados da página da SEFAZ
 */
export async function createVirtualDocument(url: string): Promise<Document> {
    'use server'
    if (!checkURL(url))
        throw (`Este QR Code não é válido para nosso sistema.`);
    const { JSDOM } = jsdom;
    const response = await axios.get(url)
        .then((response) => {
            const { data } = response;
            const virtualDocument = new JSDOM(data);
            return virtualDocument.window.document;
        })
        .catch((error: AxiosError) => {
            handleError(error);
            return error.message;
        });
    if (typeof (response) === 'string')
        throw (`Erro interno - ${response}`);
    return response;
}

/**
 * Retorna os dados do Mercado
*/
export async function createMarket(doc: Document): Promise<Mercado> {
    'use server'
    const cnpj = getNumberCNPJ(doc);
    const market = await checkExistObject('mercado', cnpj);
    if (market) return Promise.resolve(market);
    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage = 'Dados do CNPJ - Tempo de espera de resposta do servidor encerrado.';
    const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj.replace(/[^\d]/g, '')}`)
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
            } as Mercado;
        })
        .catch((error: AxiosError) => {
            handleError(error);
            return error.message;
        });
    if (typeof (response) === 'string')
        throw (`Erro interno - ${response}`);
    return response;
};

/**
* Retorna os CNPJ do mercado emissor da Nota Fiscal
*/
function getNumberCNPJ(doc: Document) {
    const element = doc.querySelector('tbody tr:first-of-type td') as Element;
    const allText = String(element.textContent);
    const limiter = allText.indexOf(',');
    return allText.slice(0, limiter).replace(/[^\d]/g, '');
}

/**
* Retorna os dados da Nota Fiscal
*/
export async function getInvoice(doc: Document, url: string): Promise<NotaFiscal> {
    'use server'
    try {
        let element = doc.getElementById('collapseTwo') as HTMLElement;
        const key = element.querySelector('table tbody tr:first-of-type td')?.textContent;
        const invoice = await checkExistObject('notaFiscal', String(key)).catch(() => { throw ('Erro interno ao verificar se o cupom já está cadastrado.') });
        if (invoice) throw ('Este cupom já está cadastrado.')
        element = doc.getElementById('collapse4') as HTMLElement;
        const table = element.querySelector('table:nth-child(8)') as Element;
        const line = table.querySelector('tbody tr') as Element;
        const columns = line.querySelectorAll('td');
        const date = columns[3].textContent || FormatDate(new Date());
        return {
            CNPJ: getNumberCNPJ(doc),
            chave: String(key).replace(/[^\d]/g, ''),
            data: date.slice(0, 10),
            url,
            userID: null
        };
    } catch {
        throw ('Erro interno ao obter dados do cupom fiscal.')
    }
}

/**
* Retorna os itens da Nota Fiscal (sem repetição)
*/
export function getItems(doc: Document, market: Mercado, invoice: NotaFiscal): Array<Precos> {
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
        const key = columnData[0] + '_' + columnData[1] + '_' + columnData[3];
        if (!items[key]) {
            items[key] = {
                data: invoice.data,
                idMercado: market.id || '',
                idNotaFiscal: invoice.id || '',
                mercado: market.nomeFantasia,
                produto: columnData[0],
                unidadeMedida: columnData[2].slice(4),
                valor: ConvertStringToNumber(String(totalPrice / amount)),
            };
        }
    });
    return Object.values(items)
}

function handleError(error: AxiosError) {
    console.error('Erro interno', {
        message: error.message,
        status: error.status,
        code: error.code
    });
}
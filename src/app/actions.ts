'use server'
import { Mercado, NotaFiscal, Precos, addObject, getListObject } from '@/service/firebaseService';
import axios from 'axios';
import jsdom from 'jsdom';

interface PricesWork {
    [index: string]: Precos
}

interface CreatePricesResponse {
    status: number,
    data: {
        mercado: Mercado | null,
        precos: Array<Precos> | null,
        NF: NotaFiscal | null
    }
    message: string
}

const getNumberCNPJ = (doc: Document) => {
    const element = doc.querySelector('tbody tr:first-of-type td') as HTMLElement;
    const allText = String(element.textContent);
    const limiter = allText.indexOf(',');
    return allText.slice(0, limiter).replace(/[^\d]/g, '');
}

const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const convertToNumber = (decimalPlaces: number, value: string) => {
    const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')).toFixed(decimalPlaces);
    return parseFloat(num);
}

const checkURL = (url: string) => {
    const regex = /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
}

const createVirtualDocument = async (url: string) => {
    const { JSDOM } = jsdom;
    return await axios.get(url)
        .then((response) => {
            const { data } = response;
            const virtualDocument = new JSDOM(data);
            return virtualDocument.window.document;
        })
        .catch((error) => {
            console.error('Erro ao tratar o retorno HTML da página da SEFAZ.', error);
            return null;
        });
}

export async function addTaxReceipet(url: string): Promise<CreatePricesResponse> {
    try {
        if (!checkURL(url))
            throw new Error('Código QR inválido para nosso sistema.');
        const virtualDocument = await createVirtualDocument(url);
        if (virtualDocument === null)
            throw new Error('Erro ao tratar o retorno HTML da página da SEFAZ.');
        const market = await createMarket(virtualDocument);
        if (market === null)
            throw new Error('Erro na requisição/tratamento dos dados do CNPJ');
        const invoice = createInvoice(virtualDocument, url);
        const checkInvoice = await checkExistInvoice(invoice.chave);
        if (checkInvoice as NotaFiscal && checkInvoice) 
            throw new Error('Este cupom fiscal já foi enviado.')
        const invoiceFirebase = await addObject({
            path: 'notaFiscal',
            doc: invoice
        })
        if (invoiceFirebase === null)
            throw new Error('Erro ao adicionar Nota Fiscal.')
        const checkMarket = await checkExistMarket(market.CNPJ);
        if (checkMarket as Mercado && checkMarket) {
            market.id = checkMarket.id
        } else {
            const invoiceMarket = await addObject({
                path: 'mercado',
                doc: market
            });
            if (invoiceMarket === null)
                throw new Error('Erro ao adicionar Mercado.')
            market.id = String(invoiceMarket);
        }
        const listPrices = createPrices(virtualDocument, market.id || '', invoice?.id || '', market.nomeFantasia, invoice.data);
        listPrices.forEach(async (price) =>
            await addObject({
                path: 'precos',
                doc: price
            })
        )
        return {
            status: 200,
            data: {
                mercado: market,
                NF: invoice,
                precos: listPrices
            },
            message: 'Requisição respondida'
        }
    } catch (error) {
        console.error('Erro na requisição/tratamento dos dados da NF', error);
        return {
            status: 500,
            data: {
                mercado: null,
                precos: null,
                NF: null
            },
            message: 'Erro na requisição/tratamento dos dados da NF: ' + String(error)
        }
    }
}

export async function getPrices() {
    return await getListObject('precos');
}

async function createMarket(doc: Document): Promise<Mercado | null> {
    const cnpj = getNumberCNPJ(doc);
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
            } as Mercado;
        })
        .catch((error) => {
            console.error('Erro na requisição/tratamento dos dados do CNPJ', error);
            return null;
        })
};

function createInvoice(doc: Document, url: string): NotaFiscal {
    let element = doc.getElementById('collapseTwo') as HTMLElement;
    const key = element.querySelector('table tbody tr:first-of-type td')?.textContent;
    element = doc.getElementById('collapse4') as HTMLElement;
    const table = element.querySelector('table:nth-child(8)') as Element;
    const line = table.querySelector('tbody tr') as Element;
    const columns = line.querySelectorAll('td');
    const date = columns[3].textContent || formatDate(new Date());
    return {
        CNPJ: getNumberCNPJ(doc),
        chave: String(key).replace(/[^\d]/g, ''),
        data: date.slice(0, 10),
        url,
        userID: null
    };
}

function createPrices(doc: Document, idMercado: string, idNotaFiscal: string, mercado: string, date: string): Array<Precos> {
    const table = doc.querySelector('.table.table-striped') as Element;
    const prices: PricesWork = {};
    const lines = table.querySelectorAll('tbody tr');
    lines.forEach((line) => {
        const data: string[] = [];
        const columns = line.querySelectorAll('td');
        columns.forEach((column, index) => {
            if (index == 0) {
                data[index] = String(column.querySelector('h7')?.textContent?.trim());
                return;
            }
            data[index] = String(column.textContent?.trim());
        })
        const count = convertToNumber(2, data[1]);
        const totalPrice = convertToNumber(2, data[3]);
        const key = data[0] + '_' + data[1] + '_' + data[3];
        if (!prices[key]) {
            prices[key] = {
                data: date,
                idMercado,
                idNotaFiscal,
                mercado,
                produto: data[0],
                unidadeMedida: data[2].slice(4),
                valor: convertToNumber(2, String(totalPrice / count)),
            };
        }
    });
    return Object.values(prices)
}

async function checkExistMarket(cnpj: string) {
    const listMarket = await getListObject('mercado')
    if (listMarket !== null) {
        const mercado = listMarket.map((market) => {
            if (market.CNPJ === cnpj)
                return market;
        })
        if (mercado.length > 0)
            return mercado[0]
        else
            return false;
    } else {
        throw new Error('Erro na verificação do mercado');
    }
}

async function checkExistInvoice(chave: string) {
    const listInvoice = await getListObject('notaFiscal')
    if (listInvoice !== null) {
        const invoice = listInvoice.map((invoice) => {
            if (invoice.chave === chave)
                return invoice;
        })
        if (invoice.length > 0)
            return invoice[0]
        else
            return false;
    } else {
        throw new Error('Erro na verificação da Nota Fiscal');
    }
}
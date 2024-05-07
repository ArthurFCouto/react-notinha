'use server'
import axios from 'axios';
import jsdom from 'jsdom';

interface Prices {
    [index: string]: {
        nome: string,
        unidadeMedida: string,
        valor: string
    }
}

interface Market {
    CEP: string,
    CNPJ: string,
    UF: string,
    bairro: string,
    cidade: string,
    endereco: string,
    nomeFantasia: string,
    numero: string,
    razaoSocial: string
}

interface Invoice {
    CNPJ: string,
    chave: string,
    data: string,
    url: string,
    userID: string | null
};

export async function createPrices(url: string) {
    const { JSDOM } = jsdom;
    try {
        const response = await axios.get(url);
        const { data } = response;
        const virtualDocument = new JSDOM(data);
        const table = virtualDocument.window.document.querySelector('.table.table-striped');
        const prices: Prices = {};
        const lines = table?.querySelectorAll('tbody tr');
        lines?.forEach((line) => {
            const data: string[] = [];
            const columns = line.querySelectorAll('td');
            columns.forEach((column, index) => {
                if (index == 0) {
                    data[index] = String(column.querySelector('h7')?.textContent?.trim());
                    return;
                }
                data[index] = String(column.textContent?.trim());
            })
            const count = parseFloat(data[1].replace(/[^\d.,]/g, '').replace(',', '.'));
            const key = data[0] + '_' + data[1] + '_' + data[3];
            if (!prices[key]) {
                prices[key] = {
                    nome: data[0],
                    unidadeMedida: data[2].slice(4),
                    valor: (parseFloat(data[3].replace(/[^\d.,]/g, '').replace(',', '.'))/count).toFixed(2)
                };
            }
        });
        const market = await handleMarket(virtualDocument.window.document);
        const invoice = HandleInvoice(virtualDocument.window.document, url);
        const listPrices = Object.values(prices);
        return {
            status: 200,
            data: {
                mercado: market,
                NF: invoice,
                precos: listPrices
            }
        }
    } catch (error) {
        console.error('Erro na requisição/tratamento dos dados da NF', error);
        return {
            status: 500,
            data: error
        }
    }
}

async function handleMarket(doc: Document): Promise<Market | null> {
    const cnpj = getNumberCNPJ(doc);
    try {
        const response = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj.replace(/[^\d]/g, '')}`);
        const { data } = response;
        const market = {
            CEP: data.cep,
            CNPJ: cnpj,
            UF: data.uf,
            bairro: data.bairro,
            cidade: data.municipio,
            endereco: data.logradouro,
            nomeFantasia: data.fantasia,
            numero: data.numero,
            razaoSocial: data.nome
        }
        return market;
    } catch (error) {
        console.error('Erro na requisição/tratamento dos dados do CNPJ', error);
        return null;
    }
};

function HandleInvoice(doc: Document, url: string): Invoice {
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
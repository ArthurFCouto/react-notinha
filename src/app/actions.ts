'use server'

import { Mercado, NotaFiscal, Precos, addObject, getListObject } from '@/service/firebaseService';
import axios, { AxiosError } from 'axios';
import jsdom from 'jsdom';
import { checkURL, getInvoice, getItems, getNumberCNPJ } from '@/util/sefaz/handleHTML';

interface CreatePricesResponse {
    status: number,
    data: {
        mercado: Mercado | null,
        precos: Array<Precos> | null,
        NF: NotaFiscal | null
    }
    message: string
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
            throw new Error('Erro ao buscar dados da página da SEFAZ/MG.');
        const market = await createMarket(virtualDocument);
        if (market === null)
            throw new Error('Erro na requisição/tratamento dos dados do CNPJ');
        const invoice = getInvoice(virtualDocument, url);
        if (await checkExistInvoice(invoice.chave))
            throw new Error('Este cupom fiscal já foi enviado.')
        const invoiceFirebase = await addObject({
            path: 'notaFiscal',
            doc: invoice
        })
        if (invoiceFirebase === null)
            throw new Error('Erro ao enviar Nota Fiscal.')
        if (!market.id) {
            const marketFirebase = await addObject({
                path: 'mercado',
                doc: market
            });
            if (marketFirebase === null)
                throw new Error('Erro ao adicionar Mercado.')
            market.id = String(marketFirebase);
        }
        const items = getItems(virtualDocument, market, invoice);
        items.forEach(async (item) =>
            await addObject({
                path: 'precos',
                doc: item
            })
        )
        return {
            status: 200,
            data: {
                mercado: market,
                NF: invoice,
                precos: items
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
    const market = await checkExistMarket(cnpj);
    if(market) return market;
    axios.defaults.timeout = 30000;
    axios.defaults.timeoutErrorMessage = 'Tempo de espera de resposta do servidor encerrado.';
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
        .catch((error: AxiosError) => {
            console.error('Erro na requisição/tratamento dos dados do CNPJ', {
                message: error.message,
                status: error.status,
                code: error.code
            });
            return null;
        })
};

async function checkExistMarket(cnpj: string): Promise<undefined | Mercado> {
    return await getListObject('mercado')
        .then((list: Mercado[] | null) => {
            if (list === null)
                throw new Error('Erro na validação do mercado. Tente mais tarde.');
            else {
                let market = undefined;
                list.forEach((item) => {
                    if (item.CNPJ == cnpj)
                        market = item;
                })
                return market;
            }
        })
        .catch(() => { throw new Error('Erro na validação do mercado. Tente mais tarde.') });
}

async function checkExistInvoice(chave: string): Promise<boolean> {
    return await getListObject('notaFiscal')
        .then((list: NotaFiscal[] | null) => {
            if (list === null)
                throw new Error('Erro na validação da Nota Fiscal. Tente mais tarde.');
            else {
                let exist = false;
                list.forEach((invoice) => {
                    if (invoice.chave == chave)
                        exist = true;
                })
                return exist;
            }
        })
        .catch(() => { throw new Error('Erro na validação da Nota Fiscal. Tente mais tarde.') });
}
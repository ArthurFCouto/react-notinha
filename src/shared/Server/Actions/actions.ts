'use server'

import { addListObject, addObject, getListObject, getPricesByName } from '@/shared/service/firebase';
import { createInvoice, createListItems, createMarket, createVirtualDocument } from '@/shared/util/sefaz';

interface Response {
    status: 200 | 500,
    data: any
}

export async function addTaxReceipet(url: string): Promise<Response> {
    try {
        const virtualDocument = await createVirtualDocument(url);
        const market = await createMarket(virtualDocument);
        if (!market.id) {
            const idMarket = await addObject({
                path: 'mercado',
                doc: market
            });
            market.id = idMarket;
        }
        const invoice = await createInvoice(virtualDocument, url)
        const idInvoice = await addObject({
            path: 'notaFiscal',
            doc: invoice
        });
        invoice.id = idInvoice;
        const items = createListItems(virtualDocument, market, invoice);
        await addListObject('precos', items);
        return {
            status: 200,
            data: ''
        }
    } catch (error: any) {
        //return Promise.reject(new Error(error)) as any;
        //throw new Error(error);
        return {
            status: 500,
            data: error
        }
    }
}

export async function getPrices() {
    try {
        const list = await getListObject('precos');
        return {
            status: 200,
            data: list
        }
    } catch (error: any) {
        return {
            status: 500,
            data: error
        }
    }
}

export async function getListPricesByName(query: string) {
    try {
        const list = await getPricesByName(query);
        return {
            status: 200,
            data: list
        }
    } catch (error: any) {
        return {
            status: 500,
            data: error
        }
    }
}
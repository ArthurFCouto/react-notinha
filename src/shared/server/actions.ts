'use server';

import { addListDocuments, addDocument, getDocumentList, getPriceListByName, getPriceListByNameAndMarket } from '@/shared/service/firebase';
import { createInvoice, createListItems, createMarket, createVirtualDocument } from '@/shared/util/sefaz';

interface Response {
    status: 200 | 500,
    data: any
}

export async function addTaxCoupon(url: string): Promise<Response> {
    try {
        const virtualDocument = await createVirtualDocument(url);
        const market = await createMarket(virtualDocument);
        if (!market.id) {
            const idMarket = await addDocument('mercado', market);
            market.id = idMarket;
        }
        const invoice = await createInvoice(virtualDocument, url)
        const idInvoice = await addDocument('notaFiscal', invoice);
        invoice.id = idInvoice;
        const items = createListItems(virtualDocument, market, invoice);
        await addListDocuments({
            path: 'precos',
            data: items
        });
        return {
            status: 200,
            data: {}
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
        const list = await getDocumentList('precos');
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

export async function getPricesByName(query: string, market?: string) {
    try {
        const list = market ? await getPriceListByNameAndMarket(query, market) : await getPriceListByName(query);
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

export async function getListUrlInvoice() {
    try {
        const list = (await getDocumentList('notaFiscal')).map((invoice) => invoice.url);
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
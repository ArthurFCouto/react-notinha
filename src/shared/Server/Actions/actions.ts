'use server'

import { Mercado, NotaFiscal, Precos, addListObject, addObject, getListObject } from '@/shared/service/firebase';
import { createVirtualDocument, getInvoice, createMarket, getItems } from '@/shared/util/sefaz';

interface CreatePricesResponse {
    status: number,
    data: {
        mercado: Mercado | null,
        precos: Array<Precos> | null,
        NF: NotaFiscal | null
    }
    message: string
}

export async function addTaxReceipet(url: string): Promise<CreatePricesResponse> {
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
        const invoice = await getInvoice(virtualDocument, url)
        const idInvoice = await addObject({
            path: 'notaFiscal',
            doc: invoice
        });
        invoice.id = idInvoice;
        const items = getItems(virtualDocument, market, invoice);
        await addListObject('precos', items);
        return {
            status: 200,
            data: {
                mercado: market,
                NF: invoice,
                precos: items
            },
            message: 'Requisição respondida'
        };
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getPrices() {
    return await getListObject('precos');
}

export async function getUrlInvoice() {
    return (await getListObject('notaFiscal')).map((precos) => { return { url: precos.url } });
}
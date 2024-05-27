'use server'

import { addListObject, addObject, getListObject } from '@/shared/service/firebase';
import { createInvoice, createListItems, createMarket, createVirtualDocument } from '@/shared/util/sefaz';

export async function addTaxReceipet(url: string): Promise<void> {
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
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getPrices() {
    return await getListObject('precos');
}
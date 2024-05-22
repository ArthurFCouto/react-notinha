'use server'

import { Mercado, NotaFiscal, Precos, addObject, getListObject } from '@/shared/service/firebase';
import { createVirtualDocument, getInvoice, createMarket, getItems } from '@/shared/util/sefaz';
import { FirebaseError } from 'firebase/app';

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
        const virtualDocument = await createVirtualDocument(url).catch((error) => { throw (error) });
        const invoice = await getInvoice(virtualDocument, url).catch((error) => { throw (error) });
        const idInvoice = await addObject({
            path: 'notaFiscal',
            doc: invoice
        }).catch((error: FirebaseError) => { throw (error.message) });
        invoice.id = String(idInvoice);
        const market = await createMarket(virtualDocument).catch((error) => { throw (error) });
        if (!market.id) {
            const marketFirebase = await addObject({
                path: 'mercado',
                doc: market
            }).catch((error: FirebaseError) => { throw (error.message) });
            market.id = String(marketFirebase);
        }
        const items = getItems(virtualDocument, market, invoice);
        items.forEach(async (item) =>
            await addObject({
                path: 'precos',
                doc: item
            })
        )
        return Promise.resolve({
            status: 200,
            data: {
                mercado: market,
                NF: invoice,
                precos: items
            },
            message: 'Requisição respondida'
        });
    } catch (error) {
        return Promise.reject({
            status: 500,
            data: {
                mercado: null,
                precos: null,
                NF: null
            },
            message: 'Erro na requisição/tratamento dos dados da NF: ' + String(error)
        });
    }
}

export async function getPrices() {
    return await getListObject('precos');
}
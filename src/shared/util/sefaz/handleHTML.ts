import { Mercado, NotaFiscal, Precos } from '@/shared/service/firebaseService';
import { ConvertStringToNumber, FormatDate } from '..';

export function checkURL(url: string) {
    const regex = /portalsped\.fazenda\.mg\.gov\.br\/portalnfce\/sistema\/qrcode\.xhtml\?p=/;
    return regex.test(url);
}

/**
 * Retorna os dados da Nota Fiscal
 */
export function getInvoice(doc: Document, url: string): NotaFiscal {
    let element = doc.getElementById('collapseTwo') as HTMLElement;
    const key = element.querySelector('table tbody tr:first-of-type td')?.textContent;
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
}

/**
 * Retorna os CNPJ do mercado emissor da Nota Fiscal
 */
export function getNumberCNPJ(doc: Document) {
    const element = doc.querySelector('tbody tr:first-of-type td') as Element;
    const allText = String(element.textContent);
    const limiter = allText.indexOf(',');
    return allText.slice(0, limiter).replace(/[^\d]/g, '');
}

interface PricesWork {
    [index: string]: Precos
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
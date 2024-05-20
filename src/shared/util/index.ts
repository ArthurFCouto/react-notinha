/**
 *Retorna a data no formato DD/MM/AAAA
 */
export function FormatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function BRCurrencyFormat(value: number) {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function ConvertStringToNumber(value: string) {
    const num = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')).toFixed(2);
    return parseFloat(num);
}
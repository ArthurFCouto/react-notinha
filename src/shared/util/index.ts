export function BRCurrencyFormat(value: number) {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function ConvertStringToNumber(value: string) {
    const num = value.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(num);
}

/**
 * Retorna uma string com a data no formato BR dd/mm/aaaa
 * @param date Date
 * @returns string 
 */
export function FormatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Retorna o timestamp da data do tipo BR informada
 * @param date String no formato BR dd/mm/aaaa
 * @returns number
 */
export function CustomGetTime(dateBR: string) {
    const currentDate = dateBR.split('/');
    return new Date(`${currentDate[1]}/${currentDate[0]}/${currentDate[2]}`).getTime();
}
export function BRCurrencyFormat(value: number) {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function ConvertStringToNumber(value: string) {
    const num = value.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(num);
}

/**
 *Retorna a data no formato DD/MM/AAAA
 */
export function FormatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * 
 * @param date No formato 'dd/mm/aaaa'
 * @returns Timestamp
 */
export function CustomGetTime(date: string) {
    const currentDate = date.split('/');
    return new Date(`${currentDate[1]}/${currentDate[0]}/${currentDate[2]}`).getTime();
}
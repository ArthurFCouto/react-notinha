export function BRCurrencyFormat(value: number) {
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function ConvertStringToNumber(value: string) {
    const num = value.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(num);
}

/**
 * @param date Do tipo Date
 * @returns string no formato de data BR dd/mm/aaaa
 */
export function FormatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * @param date Do tipo string no formato BR dd/mm/aaaa
 * @returns Timestamp
 */
export function CustomGetTime(date: string) {
    const currentDate = date.split('/');
    return new Date(`${currentDate[1]}/${currentDate[0]}/${currentDate[2]}`).getTime();
}
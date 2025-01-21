export function BRCurrencyFormat(value: number) {
  return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
}

export function ConvertStringToNumber(value: string) {
  let sanitized = value.replace(/[^\d.,]/g, '');

  if (sanitized.includes(',') && sanitized.includes('.')) {
    sanitized = sanitized.replace(/\./g, '');
    sanitized = sanitized.replace(',', '.');
  } else if (sanitized.includes(',')) {
    sanitized = sanitized.replace(',', '.');
  }

  return parseFloat(sanitized);
}

/**
 * Converte um timestamp em uma data no formado BR dd/mm/aaaa ou dd/mm
 * @param timestamp Number representando o timestamp da data
 * @returns Uma string no formato dd/mm/aaaa ou dd/mm
 */
export function MappingTimestampToDate(
  timestamp: number,
  showYear: boolean = true
) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return showYear ? `${day}/${month}/${year}` : `${day}/${month}`;
}

/**
 * Retorna o timestamp da data do tipo BR informada
 * @param date String no formato BR dd/mm/aaaa
 * @returns number
 */
export function CustomGetTime(dateBR: string) {
  const currentDate = dateBR.split('/');
  return new Date(
    `${currentDate[1]}/${currentDate[0]}/${currentDate[2]}`
  ).getTime();
}

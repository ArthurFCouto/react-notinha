import { PriceController } from '@/server/controllers/price';
import { PriceHistoryDto } from '@/server/models/dtos/priceHistory';
import RecordSet from '@/server/models/RecordSet';
import { NextResponse } from 'next/server';

/*
 * api/prices/history?idPreco=test
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idPreco = searchParams.get('idPreco');
    if (idPreco) {
      if (idPreco == 'valorMock') {
        return NextResponse.json(teste);
      }
      const response = await PriceController.GetHistoryByIdPreco(idPreco);
      return NextResponse.json(response);
    }
    return NextResponse.json(
      { error: 'Favor enviar o parametro [idPreco]' },
      { status: 400 }
    );
  } catch (error: any) {
    return ErrorMapping(error);
  }
}

const ErrorMapping = (error: any) => {
  let status = 500;
  if (typeof error == 'string' || error instanceof String) {
    const regex = /^(\d{3}) - (.+)/;
    const match = error.match(regex);
    status = match ? parseInt(match[1]) : 500;
    error = match ? match[2] : error;
  }
  return NextResponse.json({ error }, { status: status });
};

const teste = {
  totalDeRegistros: 50,
  quantidadePorPagina: 50,
  pagina: 1,
  resultados: [
    {
      id: '4okA6Nrp5NSW5MMI4S26',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: '62EvYurEzbbR1Yp4WdEQ',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: '6Rpa71v3nVHCUr1sfuTZ',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: '7iNTgBVyhdnwSzHjTPJC',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: '8Lqr2qBEGYGzrj3t1Hpo',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: '8nCulk4vMPkfB7P6Ij8j',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'APHOeGSPDWNafra4tUCc',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'CCW8l1u8V7Qc3fuDZkrI',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'G3EniZKxttp45Ln8fQml',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'GE8nsaCs4ZoxLYaLl7wN',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'HsVLzdYOt3sDO4E7H9ON',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'JxvkonvYselISEG50NSc',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'MZtxWN6FYmBNOBa9LaBi',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'S2XGHoafIYyzAjCpeMbo',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'SBineItPqk8PUjPwjIFE',
      valor: '5.99',
      chaveNotaFiscal: '31240502274225000161650050002330161830154782',
      dataInclusao: '21/05/2024',
    },
    {
      id: 'TgKSDn85EuJ84qbjfGtE',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'U0saB1idpZTVBquBLTrz',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'YwfGyZsCkOpHOAPufElv',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'aK1cTZjRQT2xeau6SxC0',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'aK5O541eLS3LRsEVBtvn',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'b8uN0Ymr21hdLSpKAvhL',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'bKHauFWmsHXNLAUtrELc',
      valor: '5.99',
      chaveNotaFiscal: '31241202274225000161650040003568051127256991',
      dataInclusao: '10/12/2024',
    },
    {
      id: 'bnAboA5xCHEMxtHWhuDC',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'cQOAnwLSsEZvehzGJnuT',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'eZoY78naAKzsOd0x6I3a',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'fI12UInU7nBXIOLlx0ek',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'huNaBzGyUKIcOXdbGJ2Q',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'ilEVjDgBmUJ2ksyC3GZd',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'jghC67SeWvl7Tc1dZgf2',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650060003208519266339193',
      dataInclusao: '18/01/2025',
    },
    {
      id: 'qhDHwg2vWLVxrPq3QxtY',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'rmnJCOKttxRFFT9Pz0rY',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'sHypW5no7Yqg1nOFjjW0',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'tdu8pTtL0whcIcpjXE7r',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'u0ag42NIdeJEgZfgWGFF',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'uhx1cnajx8R4xHYTFltb',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'uyFL0ZJqnsML7J5h0cdE',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'wlICJvqYCt6BjgPFkQRC',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650060003208519266339193',
      dataInclusao: '18/01/2025',
    },
    {
      id: 'xi0gH0piiDubQ4vx5KQ6',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'ygYrrBGAUzSJnlTfcfN8',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
    {
      id: 'zENBSjMVDImi4GvaCTGd',
      valor: '6.25',
      chaveNotaFiscal: '31250102274225000161650080000728641358988788',
      dataInclusao: '08/01/2025',
    },
  ],
} as RecordSet<PriceHistoryDto>;

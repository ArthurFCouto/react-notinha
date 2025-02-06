import { PriceController } from '@/server/controllers/price';
import { PriceDto } from '@/server/models/dtos/price';
import RecordSet from '@/server/models/RecordSet';
import { NextResponse } from 'next/server';

/*
 * api/prices?cnpjMercado=test&nomeProduto=test&comHistorico=true&pagina=0&quantidadePorPagina&index=string
 */
export async function GET(request: Request) {
  // TO DO - Melhorar essa rota de API
  try {
    const { searchParams } = new URL(request.url);
    const cnpjMarket = searchParams.get('cnpjMercado');
    const productName = searchParams.get('nomeProduto');
    const withHistory = searchParams.get('comHistorico');
    const offset = searchParams.get('offset') ?? '';
    const amount = parseInt(String(searchParams.get('quantidadePorPagina')));
    const perPage = isNaN(amount) ? 20 : amount;
    if (productName) {
      if (productName == 'valorMock') {
        return NextResponse.json(teste);
      }
      const response = await PriceController.GetByName(
        productName,
        offset,
        perPage
      );
      return NextResponse.json(response);
    } else if (cnpjMarket) {
      const response = await PriceController.GetByMarket(
        cnpjMarket,
        offset,
        perPage
      );
      return NextResponse.json(response);
    } else if (withHistory) {
      const response = await PriceController.GetOnlyWithHistory(
        offset,
        perPage
      );
      return NextResponse.json(response);
    }
    const response = await PriceController.GetAll(offset, perPage);
    return NextResponse.json(response);
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
      id: 'FEItuOE1s85xCnbEWjPA',
      nomeMercado: 'SUPERMERCADO JACI',
      nomeProduto: 'BANANA PRATA',
      unidadeMedida: 'KG',
      valor: '6.24',
      cnpjMercado: '02274225000161',
      chaveNotaFiscal: '31250102274225000161650060003208519266339193',
      possuiHistorico: true,
      dataInclusao: '18/01/2025',
    },
  ],
} as RecordSet<PriceDto>;

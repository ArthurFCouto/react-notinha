import { PriceController } from '@/server/controllers/price';
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

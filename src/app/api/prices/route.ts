import { PriceController } from '@/server/controllers/price';
import { NextResponse } from 'next/server';

/*
 * api/prices?idMercado=test&nomeProduto=test&comHistorico=true&pagina=0&quantidadePorPagina
 */
export async function GET(request: Request) {
  // TO DO - Melhorar essa rota de API
  try {
    const { searchParams } = new URL(request.url);
    const idMarket = searchParams.get('idMercado');
    const productName = searchParams.get('nomeProduto');
    const withHistory = searchParams.get('comHistorico');
    const page = searchParams.get('pagina')
      ? parseInt(String(searchParams.get('pagina')))
      : 1;
    const perPage = searchParams.get('quantidadePorPagina')
      ? parseInt(String(searchParams.get('quantidadePorPagina')))
      : 20;
    if (idMarket && productName) {
      const response = await PriceController.GetByNameAndMarket(
        productName,
        idMarket,
        page,
        perPage
      );
      return NextResponse.json({ response });
    } else if (productName) {
      const response = await PriceController.GetByName(
        productName,
        page,
        perPage
      );
      return NextResponse.json({ response });
    } else if (idMarket) {
      const response = await PriceController.GetByMarket(
        idMarket,
        page,
        perPage
      );
      return NextResponse.json({ response });
    } else if (withHistory) {
      const response = await PriceController.GetOnlyWithHistory(page, perPage);
      return NextResponse.json({ response });
    }
    const response = await PriceController.GetAll(page, perPage);
    return NextResponse.json({ response });
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

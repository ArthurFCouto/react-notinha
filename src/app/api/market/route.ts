import { MarketController } from '@/server/controllers/market';
import { MarketEntity } from '@/server/entities/market';
import { NextResponse } from 'next/server';

/*
 * api/market?cnpj=string
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj');
    const response = await MarketController.CheckMarketDoesExist(cnpj!);
    return NextResponse.json(response);
  } catch (error) {
    return ErrorMapping(error);
  }
}

/*
 * api/market {market: Market}
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => undefined);
    const market = body ? body.market : (body as MarketEntity);
    if (!market)
      return NextResponse.json(
        { error: 'Favor enviar o parametro [market]' },
        { status: 400 }
      );
    const response = await MarketController.CreateMarket(market);
    return NextResponse.json(response);
  } catch (error) {
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

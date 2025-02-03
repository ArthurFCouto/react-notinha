import { PriceController } from '@/server/controllers/price';
import { NextResponse } from 'next/server';

/*
 * api/prices/history?idPreco=test
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idPreco = searchParams.get('idPreco');
    if (idPreco) {
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

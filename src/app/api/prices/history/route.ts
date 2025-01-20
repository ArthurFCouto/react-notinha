import { PriceController } from '@/server/controllers/price';
import { NextResponse } from 'next/server';

/*
 * api/prices/history?ids=test
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    if (ids) {
      const response = await PriceController.GetHistory(ids.split(';'));
      return NextResponse.json({ data: response });
    }
    return NextResponse.json(
      { error: 'Favor enviar o parametro [ids]' },
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

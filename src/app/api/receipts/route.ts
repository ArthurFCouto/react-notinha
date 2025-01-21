import { ReceiptController } from '@/server/controllers/receipt';
import { NextResponse } from 'next/server';

/*
 * api/receipts {url: strings}
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => undefined);
    const url = body ? body.url : body;
    if (!url)
      return NextResponse.json(
        { error: 'Favor enviar o parametro [url]' },
        { status: 400 }
      );
    const response = await ReceiptController.CreateReceipt(url);
    return NextResponse.json(response);
  } catch (error: any) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts
 */
export async function GET(request: Request) {
  try {
    const response = await ReceiptController.GetAllReceipts();
    return NextResponse.json({ response });
  } catch (error) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts?chaves=string;string
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get('chaves');
    if (keys) {
      const response = await ReceiptController.DeleteListByKeyList(
        keys.split(';')
      );
      return NextResponse.json({ response });
    }
    return NextResponse.json(
      { error: 'Favor enviar o parametro [keys]' },
      { status: 400 }
    );
  } catch (error) {
    return ErrorMapping(error);
  }
}

const ErrorMapping = (error: any) => {
  console.log('Erro', error);
  let status = 500;
  if (typeof error == 'string' || error instanceof String) {
    const regex = /^(\d{3}) - (.+)/;
    const match = error.match(regex);
    status = match ? parseInt(match[1]) : 500;
    error = match ? match[2] : error;
  }
  return NextResponse.json({ error }, { status: status });
};

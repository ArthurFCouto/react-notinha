import { ReceiptController } from '@/server/controllers/receipt';
import { NextResponse } from 'next/server';

/*
 * api/receipts?url=test
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json();
    console.log('Nome', body);
    const url = searchParams.get('url');
    if (!url)
      return NextResponse.json(
        { error: 'Favor enviar o parametro [url]' },
        { status: 400 }
      );
    await ReceiptController.CreateReceipt(url);
    return NextResponse.json({});
  } catch (error: any) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts?getTotalAmount=true
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const getTotalAmount = searchParams.get('getTotalAmount');
    if (getTotalAmount) {
      const amount = await ReceiptController.GetTotalAmount();
      return NextResponse.json({ data: amount });
    }
    const receipts = await ReceiptController.GetAllReceipt();
    return NextResponse.json({ data: receipts });
  } catch (error) {
    return ErrorMapping(error);
  }
}

/*
 * api/receipts?keys=string;string
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get('keys');
    if (keys) {
      const chaves = keys.split(';');
      chaves.forEach(
        async (chave) => await ReceiptController.DeleteListByKey(chave)
      );
      return NextResponse.json({ data: keys.split(';') });
    }
    const receipts = await ReceiptController.GetAllReceipt();
    return NextResponse.json({ data: receipts });
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

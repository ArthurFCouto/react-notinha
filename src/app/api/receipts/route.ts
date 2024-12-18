import { ReceiptController } from '@/server/controller/receipt';
import { NextResponse } from 'next/server';

/*
 * api/receipts?url=test
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    if (!url)
      return NextResponse.json(
        { error: 'Favor checar o parametro "url"' },
        { status: 400 }
      );

    await ReceiptController.CreateReceipt(url);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

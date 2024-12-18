import { PriceController } from '@/server/controller/price';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idProduto = searchParams.get('idProduto');
    if (idProduto) {
      const response = await PriceController.GetHistory(idProduto);
      return NextResponse.json({ data: response });
    }

    return NextResponse.json(
      { error: 'Favor checar o parametro "idProduto"' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

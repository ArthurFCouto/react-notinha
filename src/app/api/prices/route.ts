import { PriceController } from '@/server/controller/price';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idMarket = searchParams.get('idMercado');
    const productName = searchParams.get('nomeProduto');
    if (idMarket && productName) {
      const response = await PriceController.GetByNameAndMarket(
        productName,
        idMarket
      );
      return NextResponse.json({ data: response });
    } else if (productName) {
      const response = await PriceController.GetByName(productName);
      return NextResponse.json({ data: response });
    } else if (idMarket) {
      const response = await PriceController.GetByMarket(idMarket);
      return NextResponse.json({ data: response });
    }
    const response = await PriceController.GetAll();
    return NextResponse.json({ data: response });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

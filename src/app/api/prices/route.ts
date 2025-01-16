import { PriceController } from '@/server/controller/price';
import { NextResponse } from 'next/server';

/*
 * api/prices?idMercado=test&nomeProduto=test
 */
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
    return ErrorMapping(error);
  }
}

/*
 * api/prices?deleteAll=false&ids=test;test
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll');
    if (id) {
      const ids = id.split(';');
      await PriceController.DeleteById(ids);
    } else if (deleteAll) {
      await PriceController.DeleteAll();
    }
    return NextResponse.json({});
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

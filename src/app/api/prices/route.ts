import { getDocumentList, Price } from '@/shared/service/firebase';
import { CustomGetTime } from '@/shared/util';
import { NextResponse } from 'next/server';

function RemoveDuplicatePrice(originalList: Price[]): Price[] {
    if (originalList.length === 0)
        return originalList;
    const map: {
        [key: string]: Price
    } = {};

    originalList.forEach((preco) => {
        const { produto, data, mercado } = preco;
        const key = produto + '_' + mercado;
        if (map[key]) {
            // The date has the format dd/mm/yyyy
            const currentDate = CustomGetTime(data);
            const listItemDate = CustomGetTime(map[key].data);
            if (currentDate > listItemDate)
                map[key] = preco;
        } else {
            map[key] = preco;
        }
    });
    return Object.values(map);
}

export async function GET() {
    try {
        const list = await getDocumentList('precos');
        return NextResponse.json({ data: RemoveDuplicatePrice(list) });
    } catch (error: any) {
        return NextResponse.json({error});
    }
}
import { Dispatch, SetStateAction } from 'react';
import { getListPricesByName } from '@/shared/Server/Actions/actions';
import { Precos } from '@/shared/service/firebase';
import { CustomGetTime } from '@/shared/util';

export async function UpdateChart(query: string, setPrices: Dispatch<SetStateAction<Precos[]>>, setLoading: Dispatch<SetStateAction<boolean>>, onError: Function) {
    await getListPricesByName(query)
        .then((precos) => setPrices(OrderByDate(precos)))
        .catch((error) => {
            onError(error.message);
            close();
        });
    setLoading(false);
}

function OrderByDate(list: Precos[]) {
    const newList = list.sort((prev, last) => CustomGetTime(prev.data) - CustomGetTime(last.data));
    const length = newList.length;
    if (length > 10) {
        return newList.slice(length - 10, length - 1);
    }
    return newList;
}
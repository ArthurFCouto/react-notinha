import { Dispatch, SetStateAction } from 'react';
import { Price } from '@/shared/service/firebase';
import { getPricesByName } from '@/shared/server/actions/actions';
import { ConvertStringToNumber, CustomGetTime } from '@/shared/util';

export async function UpdateChart(onError: Function, query: string, setLoading: Dispatch<SetStateAction<boolean>>, setPrices: Dispatch<SetStateAction<Price[]>>, setVariation: Dispatch<SetStateAction<number>>) {
    await getPricesByName(query)
        .then((response) => {
            if (response.status === 200) {
                setPrices(OrderByDate(response.data));
                setVariation(CalculateVariance(response.data));
            } else {
                onError(response.data);
                close();
            }
        });
    setLoading(false);
}

function OrderByDate(list: Price[]) {
    const newList = list.sort((prev, last) => CustomGetTime(prev.data) - CustomGetTime(last.data));
    const length = newList.length;
    if (length > 10) {
        return newList.slice(length - 10, length - 1);
    }
    return newList;
}

function CalculateVariance(list: Price[]) {
    const length = list.length;
    const prev = ConvertStringToNumber(list[0].valor);
    const last = ConvertStringToNumber(list[length-1].valor);
    return ConvertStringToNumber(((prev-last)/prev*100).toFixed(2));
}
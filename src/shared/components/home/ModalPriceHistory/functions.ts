import { Dispatch, SetStateAction } from 'react';
import { getListPricesByName } from '@/shared/Server/Actions/actions';
import { Precos } from '@/shared/service/firebase';

export async function UpdateChart(query: string, setPrices: Dispatch<SetStateAction<Precos[]>>, setLoading: Dispatch<SetStateAction<boolean>>, onError: Function) {
    await getListPricesByName(query)
        .then((precos) => setPrices(precos))
        .catch((error) => {
            onError(error.message);
            close();
        });
    setLoading(false);
}
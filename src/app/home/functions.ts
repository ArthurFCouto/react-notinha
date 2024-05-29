import { addTaxReceipet, getPrices } from "@/shared/Server/Actions/actions";
import { Precos } from "@/shared/service/firebase";
import { Dispatch, SetStateAction } from "react";

type AlertClose = {
    type: 'close'
};

type AlertOpen = {
    type: 'open';
    message: string;
    severity: 'success' | 'error'
};

type AlertActions = AlertClose | AlertOpen;

interface AlertState {
    message: string,
    severity: 'success' | 'error',
    open: boolean
}

export function HandleStateAlert(state: AlertState, action: AlertActions) {
    switch (action.type) {
        case 'close':
            return { ...state, open: false };
        case 'open':
            return { ...state, message: action.message, open: true, severity: action.severity }
        default:
            return state;
    }
}

export async function SendUrl(url: string, sendingUrl: boolean, setSendingUrl: Dispatch<SetStateAction<boolean>>, dispatchAlert: Dispatch<AlertActions>) {
    if (sendingUrl) {
        dispatchAlert({ type: 'open', message: 'Aguarde e tente mais tarde.', severity: 'error' });
        return;
    }
    setSendingUrl(true);
    await addTaxReceipet(url)
        .then(() => {
            dispatchAlert({
                type: 'open',
                message: 'Obrigado pelo seu envio. Atualize a lista de preços.',
                severity: 'success'
            });
        })
        .catch((error) => {
            dispatchAlert({
                type: 'open',
                message: error.message,
                severity: 'error'
            });
        })
    setSendingUrl(false);
};

export async function UpdateListPrices(loading: boolean, setLoading: Dispatch<SetStateAction<boolean>>, setPrices: Dispatch<SetStateAction<Precos[]>>, setOriginalPrices: Dispatch<SetStateAction<Precos[]>>, dispatchAlert: Dispatch<AlertActions>) {
    if (loading) return;
    setLoading(true);
    setPrices([]);
    setOriginalPrices([]);
    await getPrices()
        .then((precos) => {
            if (precos.length === 0)
                dispatchAlert({ type: 'open', message: 'Não há preços cadastrados no momento.', severity: 'error' });
            else {
                setPrices(RemoveDuplicateProduct(precos));
                setOriginalPrices(RemoveDuplicateProduct(precos));
            }
        })
        .catch((error) => {
            dispatchAlert({ type: 'open', message: error.message, severity: 'error' });
        });
    setLoading(false);
}

function RemoveDuplicateProduct(originalList: Precos[]): Precos[] {
    if (originalList.length === 0)
        return originalList;
    const map: {
        [key: string]: Precos
    } = {};

    originalList.forEach(preco => {
        const { produto, data, mercado } = preco;
        const key = produto + '_' + mercado;
        if (map[key]) {
            if (new Date(data) > new Date(map[key].data)) {
                map[key] = preco;
            }
        } else {
            map[key] = preco;
        }
    });
    return Object.values(map);
}

export function FilterListPrices(loading: boolean, originalPrices: Precos[], setPrices: Dispatch<SetStateAction<Precos[]>>, value: string) {
    if (originalPrices.length === 0 || loading) return
    setPrices(originalPrices.filter((price) => (price.mercado.toLowerCase().includes(value.toLowerCase()) || price.produto.toLowerCase().includes(value.toLowerCase()) || price.data.toLowerCase().includes(value.toLowerCase()))));
}
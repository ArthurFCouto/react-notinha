import { Dispatch, SetStateAction } from 'react';
import { addTaxCoupon, getPrices } from '@/shared/server/actions';
import { Price } from '@/shared/service/firebase';

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
};

export async function SendUrl(url: string, sendingUrl: boolean, setSendingUrl: Dispatch<SetStateAction<boolean>>, dispatchAlert: Dispatch<AlertActions>) {
    if (sendingUrl) {
        dispatchAlert({ type: 'open', message: 'Aguarde e tente mais tarde.', severity: 'error' });
        return;
    }
    setSendingUrl(true);
    await addTaxCoupon(url)
        .then((response) => {
            if (response.status === 200)
                dispatchAlert({
                    type: 'open',
                    message: 'Obrigado pelo seu envio. Atualize a lista de preços.',
                    severity: 'success'
                });
            else
                dispatchAlert({
                    type: 'open',
                    message: response.data,
                    severity: 'error'
                });
            setSendingUrl(false);
        })
};

export async function UpdateListPrices(loading: boolean, setLoading: Dispatch<SetStateAction<boolean>>, setOriginalPrices: Dispatch<SetStateAction<Price[]>>, dispatchAlert: Dispatch<AlertActions>) {
    if (loading) return;
    setLoading(true);
    setOriginalPrices([]);
    await getPrices()
        .then((response) => {
            if (response.status === 200) {
                const { data } = response;
                if (data.length === 0)
                    dispatchAlert({ type: 'open', message: 'Não há preços cadastrados no momento.', severity: 'error' });
                else 
                    setOriginalPrices(data);
            } else {
                dispatchAlert({ type: 'open', message: response.data, severity: 'error' });
            }
        });
    setLoading(false);
};
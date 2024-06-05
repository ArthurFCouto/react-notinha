import {
    addDoc, collection, doc, getDocs,
    getFirestore, orderBy, query, where, writeBatch
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import firebase from '@/shared/config/firebase';

export interface ErrorLog {
    code: string,
    message: string,
    stack: string,
    status: string,
}

export interface Market {
    id?: string,
    CEP: string,
    CNPJ: string,
    UF: string,
    bairro: string,
    cidade: string,
    endereco: string,
    nomeFantasia: string,
    numero: string,
    razaoSocial: string
}

interface MarketFirebase {
    name: 'mercado',
    data: Market[]
}

export interface Invoice {
    id?: string,
    CNPJ: string,
    chave: string,
    data: string,
    url: string,
    userID: string | null
}

interface InvoiceFirebase {
    name: 'notaFiscal',
    data: Invoice[]
}

export interface Price {
    id?: string,
    data: string,
    idMercado: string,
    idNotaFiscal: string,
    mercado: string,
    produto: string,
    unidadeMedida: string,
    valor: string,
}

interface PriceFirebase {
    name: 'precos',
    data: Price[]
}

export async function addObject(name: 'mercado', data: Market): Promise<string>;

export async function addObject(name: 'notaFiscal', data: Invoice): Promise<string>;

export async function addObject(name: 'precos', data: Price): Promise<string>;

export async function addObject(name: 'mercado' | 'notaFiscal' | 'precos', data: Market | Invoice | Price) {
    delete data.id;
    const database = getFirestore(firebase);
    return await addDoc(collection(database, name), data)
        .then((response) => {
            return response.id as string;
        })
        .catch((error: FirebaseError) => {
            throw (`Erro ao cadastrar ${name}. ${error.message}`);
        });
}

export async function addListObject(object: MarketFirebase | InvoiceFirebase | PriceFirebase) {
    const { data, name } = object;
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    data.forEach(async (item) => {
        if(name == 'precos' && await checkIfPriceExist(item as Price)) 
            return;
        delete item.id;
        const ref = doc(collection(database, name));
        batch.set(ref, item);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            throw (`Erro ao cadastrar lista de ${name}. ${error.message}`);
        });
}

export async function createErrorLog(log: ErrorLog) {
    const data = {
        ...log,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }
    const database = getFirestore(firebase);
    await addDoc(collection(database, 'logs'), data)
        .catch((error: FirebaseError) => {
            console.log('Erro ao armazenar log de erro.', error);
        });
}

export async function getObjectList(name: 'mercado'): Promise<Market[]>;

export async function getObjectList(name: 'notaFiscal'): Promise<Invoice[]>;

export async function getObjectList(name: 'precos'): Promise<Price[]>;

export async function getObjectList(name: 'mercado' | 'notaFiscal' | 'precos'): Promise<Market[] | Invoice[] | Price[]> {
    const order = {
        'mercado': 'nomeFantasia',
        'precos': 'produto',
        'notaFiscal': 'data'
    };
    const database = getFirestore(firebase);
    const ref = query(collection(database, name), orderBy(order[name]));
    return await getDocs(ref)
        .then((response) => {
            return response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            }) as Market[] | Invoice[] | Price[];
        })
        .catch((error: FirebaseError) => {
            createErrorLog({
                code: String(error.code),
                message: error.message,
                stack: String(error.stack),
                status: String(error.name)
            });
            throw (`Erro ao buscar a lista de objetos. ${error.message}`);
        });
}

export async function checkIfObjectExist(name: 'mercado', data: string): Promise<Market | false>;

export async function checkIfObjectExist(name: 'notaFiscal', data: string): Promise<Invoice | false>;

/**
 * Retorna se um mercado ou nota fiscal está cadastrado
 * @param name Deve ser 'mercado' ou 'notaFiscal'
 * @param data Deve ser o CNPJ ou a CHAVE da nota fiscal
 * @returns Um objeto Mercado ou Nota Fiscal, ou false quando não existir
 */
export async function checkIfObjectExist(name: 'mercado' | 'notaFiscal', data: string): Promise<Market | Invoice | false> {
    const field = {
        'mercado': 'CNPJ',
        'notaFiscal': 'chave'
    };
    const database = getFirestore(firebase);
    const ref = query(collection(database, data), where(field[name], '==', data));
    return await getDocs(ref)
        .then((response) => {
            const list = response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            });
            if (list.length > 0)
                return list[0] as Market | Invoice;
            return false
        })
        .catch((error: FirebaseError) => {
            throw (`Erro ao verificar se ${name} já está cadastrado(a). ${error.message}`)
        });
}

export async function getPriceListByName(data: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), where('produto', '==', data));
    return await getDocs(ref)
        .then((response) => {
            return response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            }) as Price[];
        })
        .catch((error: FirebaseError) => {
            createErrorLog({
                code: String(error.code),
                message: error.message,
                stack: String(error.stack),
                status: String(error.name)
            });
            throw (`Erro ao buscar a preços pelo nome. ${error.message}`);
        });
}

async function checkIfPriceExist(object: Price): Promise<boolean> {
    const {data, idMercado, produto, valor} = object;
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), where('data', '==', data), where('idMercado', '==', idMercado), where('produto', '==', produto), where('valor', '==', valor));
    return await getDocs(ref)
        .then((response) => {
            const list = response.docs.map((doc) => doc.data());
            return list.length > 0;
        })
        .catch((error: FirebaseError) => {
            throw (`Erro ao verificar se ${name} já está cadastrado(a). ${error.message}`)
        });
}
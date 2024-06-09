import {
    addDoc, collection, doc, getDocs,
    getFirestore, orderBy, query, where, writeBatch
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import firebase from '@/shared/config/firebase';

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
    userID: string | null,
    valorTotal: string
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
            createErrorLog(error);
            throw (`Erro ao cadastrar ${name}. ${error.message}`);
        });
}

export async function addListObject(object: MarketFirebase | InvoiceFirebase | PriceFirebase) {
    const { data, name } = object;
    if (name === 'precos')
        return addListPrice(data);
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    data.forEach(async (item) => {
        delete item.id;
        const ref = doc(collection(database, name));
        batch.set(ref, item);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar lista de ${name}. ${error.message}`);
        });
}

async function addListPrice(data: Price[]) {
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    const listPricesOfTheDay = await getPriceListByDate(data[0].data)
        .then((prices) => prices.map((price) => `${price.produto}_${price.idMercado}_${price.valor}`));
    data.forEach(async (item) => {
        const key = `${item.produto}_${item.idMercado}_${item.valor}`;
        if (listPricesOfTheDay.includes(key))
            return;
        delete item.id;
        const ref = doc(collection(database, 'precos'));
        batch.set(ref, item);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar lista de ${name}. ${error.message}`);
        });
}

export async function createErrorLog(log: any) {
    const data =     {
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        code: log.code || 'Not specified',
        message: `${log.message} - ${log.request}`,
        stack: log.stack || 'Not specified',
        status: String(log.status) || 'Not specified'
    };
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

export async function checkIfDocumentExist(path: 'mercado', data: string): Promise<Market | false>;

export async function checkIfDocumentExist(path: 'notaFiscal', data: string): Promise<Invoice | false>;

/**
 * Retorna se um mercado ou nota fiscal está cadastrado
 * @param path Deve ser 'mercado' ou 'notaFiscal'
 * @param data Deve ser o CNPJ ou a CHAVE da nota fiscal
 * @returns Um objeto Mercado ou Nota Fiscal, ou false quando não existir
 */
export async function checkIfDocumentExist(path: 'mercado' | 'notaFiscal', data: string): Promise<Market | Invoice | false> {
    const field = {
        'mercado': 'CNPJ',
        'notaFiscal': 'chave'
    };
    const database = getFirestore(firebase);
    const ref = query(collection(database, path), where(field[path], '==', data));
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
            createErrorLog({
                code: String(error.code),
                message: error.message,
                stack: String(error.stack),
                status: String(error.name)
            });
            throw (`Erro ao verificar se ${path} já está cadastrado(a). ${error.message}`);
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

/**
 * Retorna a lista de preços cadastrados no dia informado
 * @param date Data padrão BR dd/mm/aaaa
 * @returns lista do tipo Price
 */
async function getPriceListByDate(date: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), where('data', '==', date));
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
            throw (`Erro ao buscar a preços pelo data. ${error.message}`);
        });
}
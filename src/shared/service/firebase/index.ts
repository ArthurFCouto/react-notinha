import {
    addDoc, and, collection, doc, getDocs,
    getFirestore, limit, orderBy, query, startAt, where, writeBatch
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

export interface Invoice {
    id?: string,
    CNPJ: string,
    chave: string,
    data: string,
    url: string,
    userID: string | null,
    valorTotal: string
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

export async function addDocument(path: 'mercado', data: Market): Promise<string>;

export async function addDocument(path: 'notaFiscal', data: Invoice): Promise<string>;

export async function addDocument(path: 'precos', data: Price): Promise<string>;

export async function addDocument(path: 'mercado' | 'notaFiscal' | 'precos', data: Market | Invoice | Price) {
    delete data.id;
    const database = getFirestore(firebase);
    return await addDoc(collection(database, path), data)
        .then((response) => {
            return response.id;
        })
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar ${path}. ${error.message}`);
        });
};

export async function addDocumentList(path: 'mercado', list: Market[]): Promise<void>;

export async function addDocumentList(path: 'notaFiscal', list: Invoice[]): Promise<void>;

export async function addDocumentList(path: 'precos', list: Price[]): Promise<void>;

export async function addDocumentList(path: 'mercado' | 'notaFiscal' | 'precos', list: Market[] | Invoice[] | Price[]) {
    if (path === 'precos')
        return addPriceList(list as Price[]);
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    list.forEach(async (item) => {
        delete item.id;
        const ref = doc(collection(database, path));
        batch.set(ref, item);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar lista de ${path}. ${error.message}`);
        });
};

async function addPriceList(list: Price[]) {
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    const { data } = list[0];
    const PriceListOfTheDay = await getPriceListByDate(data)
        .then((prices) => prices.map((price) => `${price.produto}_${price.idMercado}_${price.valor}`));
    list.forEach((price) => {
        const key = `${price.produto}_${price.idMercado}_${price.valor}`;
        if (PriceListOfTheDay.includes(key))
            return;
        delete price.id;
        const ref = doc(collection(database, 'precos'));
        batch.set(ref, price);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar lista de precos. ${error.message}`);
        });
};

export async function createErrorLog(log: any) {
    const data = {
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        code: log.code || 'Not specified',
        message: `${log.message}`,
        request: log.request,
        stack: log.stack || 'Not specified',
        status: String(log.status) || 'Not specified'
    };
    const database = getFirestore(firebase);
    await addDoc(collection(database, 'logs'), data)
        .catch((error: FirebaseError) => {
            console.log('Erro ao armazenar log de erro.', error);
        });
};

export async function getDocumentList(path: 'mercado'): Promise<Market[]>;

export async function getDocumentList(path: 'notaFiscal'): Promise<Invoice[]>;

export async function getDocumentList(path: 'precos'): Promise<Price[]>;

export async function getDocumentList(path: 'mercado' | 'notaFiscal' | 'precos') {
    const order = {
        'mercado': 'nomeFantasia',
        'precos': 'produto',
        'notaFiscal': 'chave'
    };
    const database = getFirestore(firebase);
    const ref = query(collection(database, path), orderBy(order[path]));
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
            createErrorLog(error);
            throw (`Erro ao buscar a lista de ${path}. ${error.message}`);
        });
};

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
            createErrorLog(error);
            throw (`Erro ao verificar se ${path} já está cadastrado(a). ${error.message}`);
        });
};

export async function getPriceListByName(name: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), where('produto', '==', name));
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
            createErrorLog(error);
            throw (`Erro ao buscar a preços pelo nome. ${error.message}`);
        });
};

export async function getPriceListByNameAndMarket(name: string, market: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), and(where('produto', '==', name), where('mercado', '==', market)));
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
            createErrorLog(error);
            throw (`Erro ao buscar a preços pelo nome. ${error.message}`);
        });
};

/**
 * Retorna a lista de preços cadastrados no dia informado
 * @param date Data padrão BR dd/mm/aaaa
 * @returns Lista do tipo Price
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
            createErrorLog(error);
            throw (`Erro ao buscar a preços pelo data. ${error.message}`);
        });
};

export async function getPriceListWithPagination(start: number, end: number): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, 'precos'), orderBy('produto'), startAt(start), limit(end));
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
            createErrorLog(error);
            throw (`Erro ao buscar a lista de precos. ${error.message}`);
        });
};
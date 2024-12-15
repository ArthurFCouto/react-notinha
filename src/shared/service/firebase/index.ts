import {
    addDoc, and, collection, doc, getDocs,
    getFirestore, limit, orderBy, query, startAt, where, writeBatch
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import firebase from '@/shared/config/firebase';

type PathNotaFiscal = 'notaFiscal';
const pathNotaFiscal: PathNotaFiscal = 'notaFiscal';

type PathPrecos = 'precos';
const pathPrecos: PathPrecos = 'precos';


const field = {
    'mercado': 'CNPJ',
    'notaFiscal': 'chave'
};

const order = {
    'mercado': 'nomeFantasia',
    'precos': 'produto',
    'notaFiscal': 'chave'
};



export async function addDocument(path: PathNotaFiscal, data: Invoice): Promise<string>;

export async function addDocument(path: PathPrecos, data: Price): Promise<string>;


export async function addDocumentList(path: PathMercado, list: Market[]): Promise<void>;

export async function addDocumentList(path: PathNotaFiscal, list: Invoice[]): Promise<void>;

export async function addDocumentList(path: PathPrecos, list: Price[]): Promise<void>;

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
        const ref = doc(collection(database, pathPrecos));
        batch.set(ref, price);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            createErrorLog(error);
            throw (`Erro ao cadastrar lista de preços. ${error.message}`);
        });
};

export async function 

export async function getDocumentList(path: PathMercado): Promise<Market[]>;

export async function getDocumentList(path: PathNotaFiscal): Promise<Invoice[]>;

export async function getDocumentList(path: PathPrecos): Promise<Price[]>;


/**
 * Retorna se um mercado ou nota fiscal está cadastrado
 * @param path Deve ser 'mercado' ou 'notaFiscal'
 * @param data Deve ser o CNPJ ou a CHAVE da nota fiscal
 * @returns Um objeto Mercado ou Nota Fiscal, ou false quando não existir
 */
export async function checkIfDocumentExist(path: PathMercado, data: string): Promise<Market | false>;

export async function checkIfDocumentExist(path: PathNotaFiscal, data: string): Promise<Invoice | false>;


export async function getPriceListByName(name: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, pathPrecos), where('produto', '==', name));
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
            throw (`Erro ao buscar a lista de preços pelo nome. ${error.message}`);
        });
};

export async function getPriceListByNameAndMarket(name: string, market: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, pathPrecos), and(where('produto', '==', name), where('mercado', '==', market)));
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
            throw (`Erro ao buscar preços pelo nome e mercado. ${error.message}`);
        });
};

/**
 * Retorna a lista de preços cadastrados no dia informado
 * @param date Data padrão BR dd/mm/aaaa
 * @returns Lista do tipo Price
 */
async function getPriceListByDate(date: string): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, pathPrecos), where('data', '==', date));
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
            throw (`Erro ao buscar os preços pela data. ${error.message}`);
        });
};

export async function getPriceListWithPagination(start: number, end: number): Promise<Price[]> {
    const database = getFirestore(firebase);
    const ref = query(collection(database, pathPrecos), orderBy('produto'), startAt(start), limit(end));
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

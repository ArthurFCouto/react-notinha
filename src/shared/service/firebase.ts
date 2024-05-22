import { addDoc, collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import firebase from '@/shared/config/firebase';
import { FirebaseError } from 'firebase/app';

export interface Mercado {
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

interface MercadoFirebase {
    path: 'mercado',
    doc: Mercado
}

export interface NotaFiscal {
    id?: string,
    CNPJ: string,
    chave: string,
    data: string,
    url: string,
    userID: string | null
}

interface NotaFiscalFirebase {
    path: 'notaFiscal',
    doc: NotaFiscal
}

export interface Precos {
    id?: string,
    data: string,
    idMercado: string,
    idNotaFiscal: string,
    mercado: string,
    produto: string,
    unidadeMedida: string,
    valor: number,
}

interface PrecosFirebase {
    path: 'precos',
    doc: Precos
}

export async function addObject(data: MercadoFirebase | NotaFiscalFirebase | PrecosFirebase) {
    const { doc } = data;
    delete doc.id;
    const database = getFirestore(firebase);
    return await addDoc(collection(database, data.path), doc)
        .then((response) => {
            return response.id;
        })
        .catch((error: FirebaseError) => {
            console.error(`Erro ao cadastrar ${data.path}`, error);
            return null;
        });
}

export async function getListObject(data: 'mercado'): Promise<Mercado[] | null>;

export async function getListObject(data: 'notaFiscal'): Promise<NotaFiscal[] | null>;

export async function getListObject(data: 'precos'): Promise<Precos[] | null>;

export async function getListObject(data: 'mercado' | 'notaFiscal' | 'precos'): Promise<Mercado[] | NotaFiscal[] | Precos[] | null> {
    const order = {
        'mercado': 'nomeFantasia',
        'precos': 'produto',
        'notaFiscal': 'data'
    };
    const database = getFirestore(firebase);
    const collectionRef = query(collection(database, data), orderBy(order[data]));
    return await getDocs(collectionRef)
        .then((response) => {
            return response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            }) as Mercado[] | NotaFiscal[] | Precos[];
        })
        .catch((error: FirebaseError) => {
            console.error(`Erro ao buscar ${data}`, error.message);
            return null;
        });
}

export async function checkExistObject(data: 'mercado', path: string): Promise<Mercado | false | null>;

export async function checkExistObject(data: 'notaFiscal', path: string): Promise<NotaFiscal | false | null>;
/**
 * Retorna se um mercado ou nota fiscal está cadastrado
 * @param data Deve ser 'mercado' ou 'notaFiscal'
 * @param path Deve ser o CNPJ ou a CHAVE da nota fiscal
 * @returns Um objeto Mercado ou Nota Fiscal, podendo ser null se houver algum erro
 */
export async function checkExistObject(data: 'mercado' | 'notaFiscal', path: string): Promise<Mercado | NotaFiscal | false | null> {
    const order = {
        'mercado': 'CNPJ',
        'notaFiscal': 'chave'
    };
    const database = getFirestore(firebase);
    const collectionRef = query(collection(database, data), where(order[data], '==', path));
    return await getDocs(collectionRef)
        .then((response) => {
            const list = response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            });
            if (list.length > 0)
                return list[0] as Mercado | NotaFiscal;
            return false
        })
        .catch((error: FirebaseError) => {
            console.error(`Erro ao verificar se ${data} está cadastrado(a)`, error.message);
            return null;
        });
}
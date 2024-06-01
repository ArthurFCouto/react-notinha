import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, where, writeBatch } from 'firebase/firestore';
import firebase from '@/shared/config/firebase';
import { FirebaseError } from 'firebase/app';

export interface LogError {
    code: string,
    message: string,
    stack: string,
    status: string,
}

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
    valor: string,
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
            return response.id as string;
        })
        .catch((error: FirebaseError) => {
            throw (`Erro ao cadastrar ${data.path}. ${error.message}`);
        });
}

export async function addListObject(path: 'mercado' | 'notaFiscal' | 'precos', data: Mercado[] | NotaFiscal[] | Precos[]) {
    const database = getFirestore(firebase);
    const batch = writeBatch(database);
    data.forEach((item) => {
        delete item.id;
        const ref = doc(collection(database, path));
        batch.set(ref, item);
    })
    return await batch.commit()
        .catch((error: FirebaseError) => {
            throw (`Erro ao cadastrar lista de ${path}. ${error.message}`);
        });
}

export async function createLogError(log: LogError) {
    const data = {
        ...log,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }
    const database = getFirestore(firebase);
    await addDoc(collection(database, 'logs'), data)
        .catch((error: FirebaseError) => {
            console.log('Erro ao armazenar log de erro.', { error });
        });
}

export async function getListObject(data: 'mercado'): Promise<Mercado[]>;

export async function getListObject(data: 'notaFiscal'): Promise<NotaFiscal[]>;

export async function getListObject(data: 'precos'): Promise<Precos[]>;

export async function getListObject(data: 'mercado' | 'notaFiscal' | 'precos'): Promise<Mercado[] | NotaFiscal[] | Precos[]> {
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
            createLogError({
                code: String(error.code),
                message: error.message,
                stack: String(error.stack),
                status: String(error.name)
            });
            throw (`Erro ao buscar a lista de objetos. ${error.message}`);
        });
}

export async function checkExistObject(data: 'mercado', path: string): Promise<Mercado | false>;

export async function checkExistObject(data: 'notaFiscal', path: string): Promise<NotaFiscal | false>;
/**
 * Retorna se um mercado ou nota fiscal está cadastrado
 * @param data Deve ser 'mercado' ou 'notaFiscal'
 * @param path Deve ser o CNPJ ou a CHAVE da nota fiscal
 * @returns Um objeto Mercado ou Nota Fiscal, ou false quando não existir
 */
export async function checkExistObject(data: 'mercado' | 'notaFiscal', path: string): Promise<Mercado | NotaFiscal | false> {
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
            throw (`Erro ao verificar se ${data} já está cadastrado(a). ${error.message}`)
        });
}

export async function getPricesByName(data: string): Promise<Precos[]> {
    const database = getFirestore(firebase);
    const collectionRef = query(collection(database, 'precos'), where('produto', '==', data));
    return await getDocs(collectionRef)
        .then((response) => {
            return response.docs.map((doc) => {
                const object = doc.data();
                return {
                    id: doc.id,
                    ...object
                }
            }) as Precos[];
        })
        .catch((error: FirebaseError) => {
            createLogError({
                code: String(error.code),
                message: error.message,
                stack: String(error.stack),
                status: String(error.name)
            });
            throw (`Erro ao buscar a preços pelo nome. ${error.message}`);
        });
}
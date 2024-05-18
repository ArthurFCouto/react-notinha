import { addDoc, collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import firebase from '@/config/firebase';

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
    const db = getFirestore(firebase);
    const { doc } = data;
    delete doc.id;
    return await addDoc(collection(db, data.path), doc)
        .then((data) => {
            return data.id;
        })
        .catch((error: any) => {
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
    try {
        const db = getFirestore(firebase);
        const collectionRef = query(collection(db, data), orderBy(order[data]));
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map((doc) => {
            const object = doc.data();
            return {
                id: doc.id,
                ...object
            }
        }) as any;
    } catch (error) {
        console.error(`Erro ao buscar ${data}`, error);
        return null;
    }
}
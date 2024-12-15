import { FirebaseError } from 'firebase/app';
import InterfaceStrategy from '../base/interface';
import { EmptyMarket, Market } from '@/server/models/market';

class MarketService extends InterfaceStrategy
{
    private path = 'mercado';

    constructor() {
        super();
    }

    async Create(data: Market): Promise<string> {
        delete data.id;

        return await this.addDoc(this.collection(this.database, this.path), data)
            .then((response) => {
                return response.id;
            })
            .catch((error: FirebaseError) => {
                this.CreateErrorLog(error);
                throw (`Erro ao cadastrar ${this.path}. ${error.message}`);
            });
    }

    async CreateList(list: Market[]): Promise<void> {
        list.forEach(async (item) => {
            delete item.id;
            const reference = this.doc(this.collection(this.database, this.path));
            this.batch.set(reference, item);
        })

        return await this.batch.commit()
            .catch((error: FirebaseError) => {
                this.CreateErrorLog(error);
                throw (`Erro ao cadastrar lista de ${this.path}. ${error.message}`);
            });
    }

    async GetAll(): Promise<Market[]> {
        const columnOrdem = 'nomeFantasia';
        const reference = this.query(this.collection(this.database, this.path), this.orderBy(columnOrdem));

        return await this.getDocs(reference)
            .then((response) => {
                return response.docs.map((doc) => {
                    const object = doc.data();
                    return {
                        id: doc.id,
                        ...object
                    }
                }) as Market[];
            })
            .catch((error: FirebaseError) => {
                this.CreateErrorLog(error);
                throw (`Erro ao buscar a lista de ${this.path}. ${error.message}`);
            });
    }

    async CheckIfDocumentExist(cnpj: string): Promise<Market> {
        const field = 'cnpj';
        const reference = this.query(this.collection(this.database, this.path), this.where(field, '==', cnpj));
        
        return await this.getDocs(reference)
            .then((response) => {
                const list = response.docs.map((doc) => {
                    const object = doc.data();
                    return {
                        id: doc.id,
                        ...object
                    }
                });
                
                return list[0] as Market ?? EmptyMarket;
            })
            .catch((error: FirebaseError) => {
                this.CreateErrorLog(error);
                throw (`Erro ao verificar se ${this.path} já está cadastrado(a). ${error.message}`);
            });
    }
}

export default new MarketService();
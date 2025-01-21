import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/services/logs';
import { Receipt } from '@/server/entities/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptRepositoryImplements {
  private path;
  private fieldOrder;
  private fieldKey;
  private emptyReceipt;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
    this.fieldOrder =
      process.env.NODE_ENV === 'development' ? 'dataInclusao' : 'data';
    this.fieldKey = 'chave';
    this.emptyReceipt = {
      cnpj: '',
      chave: '',
      url: '',
      valorTotal: '',
      idUsuario: '',
      idMercado: '',
      dataEmissao: 0,
      dataInclusao: 0,
    } as Receipt;
  }

  async GetAll(offSet?: number, amount?: number): Promise<Array<Receipt>> {
    const reference =
      offSet && amount
        ? query(
            collection(database, this.path),
            orderBy(this.fieldOrder),
            startAt(offSet),
            limit(amount)
          )
        : query(collection(database, this.path), orderBy(this.fieldOrder));

    query(collection(database, this.path), orderBy(this.fieldOrder));

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<Receipt>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetAll (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar a lista de notas fiscais. ${error.message ?? error}`;
      });
  }

  async GetTotalAmount(): Promise<number> {
    const reference = query(collection(database, this.path));
    try {
      const snapshot = await getCountFromServer(reference);
      return snapshot.data().count;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `GetTotalAmount (${this.path})`;
      }
      LogsService.Create(error);
      throw `Erro ao buscar a quantidade total de notas fiscais. ${error.message ?? error}`;
    }
  }

  async CheckIfDoesExist(key: string): Promise<Receipt> {
    if (!this.IsValidKey(key)) {
      throw `400 - Erro ao conferir se a NF já está cadastrada, a chave informada (${key}) é inválida para nosso sistema.`;
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldKey, '==', key)
    );

    try {
      const snapshot = await getDocs(reference);
      if (snapshot.empty) {
        return this.emptyReceipt;
      }

      const object = snapshot.docs[0];
      const receipt = object.data();

      return {
        id: object.id,
        ...receipt,
      } as Receipt;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `CheckIfDoesExist (${this.path})`;
      }
      LogsService.Create(error);
      throw `Erro ao verificar se a nota fiscal já está cadastrada. ${error.message ?? error}`;
    }
  }

  async GetListByIdList(ids: Array<string>): Promise<Array<Receipt>> {
    const reference = query(collection(database, this.path));
    const prices: Array<Receipt> = [];

    await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          const price = {
            id: doc.id,
            ...object,
          } as Receipt;
          if (ids.includes(doc.id)) prices.push(price);
        });
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetListById ${this.path}`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de notas fiscais por lista de IDs. ${error.message ?? error}`;
      });

    return prices;
  }

  // TO DO - Tratar o caso de quando keys for uma quantidade superior a 30
  async GetListByKeyList(keys: Array<string>): Promise<Array<Receipt>> {
    const reference = query(
      collection(database, this.path),
      where(this.fieldKey, 'in', keys)
    );

    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<Receipt>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetByKey (${this.path})`;
        }
        LogsService.Create(error);
        throw `Erro ao buscar lista de notas fiscal por lista de chaves. ${error.message ?? error}`;
      });
  }

  private IsValidKey(key: string): boolean {
    const regex = /^\d{44}$/;
    return regex.test(key);
  }
}

export const ReceiptRepository = new ReceiptRepositoryImplements();

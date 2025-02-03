import {
  collection,
  doc,
  DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAt,
  where,
} from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '@/server/services/logs';
import { ReceiptEntity } from '@/server/entities/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptRepositoryImplements {
  private path;
  private fieldOrder;
  private emptyReceipt;
  private fieldKey;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
    this.fieldOrder = 'dataInclusao';
    this.fieldKey = 'chave';
    this.emptyReceipt = {
      cnpj: '',
      chave: '',
      url: '',
      valorTotal: '',
      idUsuario: '',
      dataEmissao: 0,
      dataInclusao: 0,
    } as ReceiptEntity;
  }

  async GetAll(offSet: string, amount: number): Promise<Array<ReceiptEntity>> {
    const snapshot = offSet.length > 0 ? await this.GetSnapshot(offSet) : null;

    const reference =
      offSet.length > 0
        ? query(
            collection(database, this.path),
            orderBy(this.fieldOrder),
            startAt(snapshot),
            limit(amount)
          )
        : query(
            collection(database, this.path),
            orderBy(this.fieldOrder),
            limit(amount)
          );

    return await getDocs(reference)
      .then(
        (response) =>
          response.docs.map((doc) => doc.data()) as Array<ReceiptEntity>
      )
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - GetAll (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos a lista de notas fiscais cadastradas.`;
      });
  }

  async GetTotalAmount(): Promise<number> {
    const reference = query(collection(database, this.path));
    try {
      const snapshot = await getCountFromServer(reference);
      return snapshot.data().count;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - GetTotalAmount (${this.path})`;
      }
      LogsService.Create(error);
      throw `Ocorreu um erro enquanto buscávamos a quantidade total de notas fiscais salvas.`;
    }
  }

  async CheckIfDoesExist(key: string): Promise<ReceiptEntity> {
    if (!this.IsValidKey(key)) {
      throw `400 - Erro ao conferir se a NF já está cadastrada, a chave informada (${key}) é inválida para nosso sistema.`;
    }

    const reference = doc(database, this.path, key);

    try {
      const snapshot = await getDoc(reference);
      const object = snapshot.data();

      return object ? (object as ReceiptEntity) : this.emptyReceipt;
    } catch (error: any) {
      if (typeof error != 'string') {
        error.message = `${error.message} - CheckIfDoesExist (${this.path})`;
      }
      LogsService.Create(error);
      throw 'Ocorreu um erro enquanto conferíamos se esta nota fiscal já está cadastrada.';
    }
  }

  async GetListByKeyList(keys: Array<string>): Promise<Array<ReceiptEntity>> {
    if (keys.length > 30) {
      throw `400 - Não é possível buscar mais de 30 objetos por vez, reduza a quantidade de objetos pesquisados (${keys.length}).`;
    }

    const reference = query(
      collection(database, this.path),
      where(this.fieldKey, 'in', keys)
    );

    return await getDocs(reference)
      .then(
        (response) =>
          response.docs.map((doc) => doc.data()) as Array<ReceiptEntity>
      )
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `GetByKey (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscavamos a lista de notas fiscais por lista de chaves.`;
      });
  }

  private async GetSnapshot(offSet: string): Promise<DocumentSnapshot> {
    const first = doc(database, this.path, offSet);
    return await getDoc(first);
  }

  private IsValidKey(key: string): boolean {
    const regex = /^\d{44}$/;
    return regex.test(key);
  }
}

export const ReceiptRepository = new ReceiptRepositoryImplements();

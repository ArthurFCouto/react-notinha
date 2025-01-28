import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { database } from '@/server/configs/firebase';
import { LogsService } from '../logs';
import { ReceiptEntity } from '@/server/entities/receipt';
import { ReceiptRepository } from '@/server/repositories/receipt';
import { FirebaseError } from 'firebase/app';

class ReceiptServiceImplements {
  private path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development' ? 'notaFiscalDev' : 'notaFiscal';
  }

  async Create(receipt: ReceiptEntity): Promise<ReceiptEntity> {
    const exist = await ReceiptRepository.CheckIfDoesExist(receipt.chave);
    if (exist.chave == receipt.chave) {
      throw `400 - Não foi possível concluir o cadastro da nota fiscal (${receipt.chave}). Este cupom já está cadastrado.`;
    }

    const reference = doc(database, this.path, receipt.chave);
    await setDoc(reference, receipt).catch((error: FirebaseError) => {
      if (typeof error != 'string') {
        error.stack = error.stack ?? `Create ${this.path}`;
      }
      LogsService.Create(error);
      throw `Não foi possível concluir o cadastro da nota fiscal (${receipt.chave}).`;
    });

    return receipt;
  }

  async DeleteList(receipts: Array<ReceiptEntity>): Promise<void> {
    if (receipts.length == 0) return;

    const chunks = this.ChunkArray(receipts, 400);

    for (const chunk of chunks) {
      const batch = writeBatch(database);
      chunk.forEach((receipt) => {
        batch.delete(doc(collection(database, this.path), receipt.chave));
      });

      await batch.commit().catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.stack = error.stack ?? `Delete ${this.path}`;
        }
        LogsService.Create(error);
        throw `Não foi possível concluir a exclusão da lista de notas fiscais.`;
      });
    }
  }

  private ChunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}

export const ReceiptService = new ReceiptServiceImplements();

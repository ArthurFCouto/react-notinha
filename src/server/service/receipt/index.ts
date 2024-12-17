import {
  Firestore,
  getFirestore,
  writeBatch,
  WriteBatch,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';

class ReceiptServiceImplements {
  private batch: WriteBatch;
  private database: Firestore;
  private path = 'notaFiscal';

  constructor() {
    this.database = getFirestore(firebase);
    this.batch = writeBatch(this.database);
  }
}

export const ReceiptService = new ReceiptServiceImplements();

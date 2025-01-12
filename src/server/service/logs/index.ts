import firebase from '@/server/configs/firebase';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

class LogsServiceImplements {
  private path = 'logs';
  private database;

  constructor() {
    this.database = getFirestore(firebase);
  }

  async Create(log: any): Promise<void> {
    const data = {
      date: Date.now(),
      code: String(log.code),
      message: String(log.message),
      request: String(log.request),
      stack: String(log.stack),
      status: String(log.status),
    };

    await addDoc(collection(this.database, this.path), data).catch(
      (error: FirebaseError) => {
        console.log('Erro ao armazenar log de erro.', error);
      }
    );
  }
}

export const LogsService = new LogsServiceImplements();

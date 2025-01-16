import { database } from '@/server/configs/firebase';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

class LogsServiceImplements {
  private path;

  constructor() {
    this.path = process.env.NODE_ENV === 'development' ? 'logsDev' : 'logs';
  }

  async Create(log: any): Promise<void> {
    const data = {
      date: Date.now(),
      code: String(log.code ?? 'Unspecified'),
      message: String(log.message ?? log),
      stack: String(log.stack ?? 'Unspecified'),
      status: String(log.status ?? 'Unspecified'),
    };

    await addDoc(collection(database, this.path), data).catch(
      (error: FirebaseError) => {
        console.log('Erro ao armazenar log de erro.', error);
      }
    );
  }
}

export const LogsService = new LogsServiceImplements();

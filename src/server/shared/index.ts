import firebase from '@/server/configs/firebase';
import { FirebaseError } from 'firebase/app';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

class SharedService {
  private path = '';
  private database;

  constructor() {
    this.database = getFirestore(firebase);
  }

  async CreateErrorLog(log: any): Promise<void> {
    const data = {
      date: Date.now(),
      code: log.code || 'Not specified',
      message: String(log.message),
      request: log.request,
      stack: log.stack || 'Not specified',
      status: String(log.status) || 'Not specified',
    };

    await addDoc(collection(this.database, this.path), data).catch(
      (error: FirebaseError) => {
        console.log('Erro ao armazenar log de erro.', error);
      }
    );
  }
}

export default new SharedService();

import {
  addDoc, and, collection, doc, Firestore, getDocs,
  getFirestore, limit, orderBy, query, startAt, where, WriteBatch, writeBatch
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import { FirebaseError } from 'firebase/app';

class NotImplementedException extends Error {
    constructor() {
      super('Method Not Implemented');
    }
  }
  
  class InterfaceStrategy {

    public addDoc = addDoc;
    public and = and;
    public batch : WriteBatch;
    public collection = collection;
    public database: Firestore;
    public doc = doc;
    public firebase = firebase;
    public getDocs = getDocs;
    public limit = limit;
    private pathLogs = 'logs';
    public orderBy = orderBy;
    public query = query;
    public startAt = startAt;
    public where = where;

    constructor() {
      this.database = getFirestore(firebase);
      this.batch = writeBatch(this.database);
    }

    async Create(data: any) :Promise<any> {
      throw new NotImplementedException();
    }

    async CreateList(list: []) :Promise<void> {
      throw new NotImplementedException();
    }
  
    async GetAll() :Promise<any> {
      throw new NotImplementedException();
    }
  
    async GetById(id: any) :Promise<any> {
      throw new NotImplementedException();
    }
  
    async GetByDescription(description: any) :Promise<any> {
      throw new NotImplementedException();
    }
  
    async Update(id: any, data: any) :Promise<any> {
      throw new NotImplementedException();
    }
  
    async Delete(id: any) :Promise<any> {
      throw new NotImplementedException();
    }

    async CheckIfDocumentExist(data: any): Promise<any>{
      throw new NotImplementedException();
    }

    async CreateErrorLog(log: any) :Promise<void> {
      const data = {
          date: Date.now(),
          code: log.code || 'Not specified',
          message: String(log.message),
          request: log.request,
          stack: log.stack || 'Not specified',
          status: String(log.status) || 'Not specified'
      };

      await addDoc(collection(this.database, this.pathLogs), data)
          .catch((error: FirebaseError) => {
              console.log('Erro ao armazenar log de erro.', error);
          });
  };
}
  
export default InterfaceStrategy;
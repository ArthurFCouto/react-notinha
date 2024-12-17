import { FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import firebase from '@/server/configs/firebase';
import SharedService from '../../shared';
import { MarketRepository } from '@/server/repository/market';
import { Market } from '@/server/models/market';

class MarketServiceImplements {
  private database: Firestore;
  private path = 'mercado';

  constructor() {
    this.database = getFirestore(firebase);
  }

  async Create(data: Market): Promise<string> {
    delete data.id;

    const market = await MarketRepository.CheckIfDoesExist(data.cnpj);
    if (market.id) return market.id;

    return await addDoc(collection(this.database, this.path), data)
      .then((response) => {
        return response.id;
      })
      .catch((error: FirebaseError) => {
        SharedService.CreateErrorLog(error);
        throw `Erro ao cadastrar ${this.path}. ${error.message}`;
      });
  }
}

export const MarketService = new MarketServiceImplements();

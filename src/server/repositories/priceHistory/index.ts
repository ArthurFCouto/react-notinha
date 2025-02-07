import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  Query,
} from 'firebase/firestore';
import { LogsService } from '@/server/services/logs';
import { PriceHistoryEntity } from '@/server/entities/priceHistory';
import { database } from '@/server/configs/firebase';
import { PriceRepository } from '../price';

class PriceHistoryRespositoryImplements {
  path;

  constructor() {
    this.path =
      process.env.NODE_ENV === 'development'
        ? 'historicoDePrecosDev'
        : 'historicoDePrecos';
  }

  async GetListByReference(
    ref: DocumentReference<DocumentData, DocumentData>
  ): Promise<Array<PriceHistoryEntity>> {
    const reference = collection(ref, this.path);

    return this.GetDocsReturnPricesHistory(reference, 'GetListByReference');
  }

  async GetListByPriceIdList(
    priceIds: Array<string>
  ): Promise<Array<PriceHistoryEntity>> {
    if (priceIds.length === 0) return [];

    const response: Array<PriceHistoryEntity> = [];
    for (const id of priceIds) {
      const ref = doc(database, PriceRepository.path, id);
      const reference = collection(ref, this.path);

      const prices = await this.GetDocsReturnPricesHistory(
        reference,
        'GetListByPriceIdList'
      );
      response.push(...prices);
    }

    return response;
  }

  private async GetDocsReturnPricesHistory(
    reference: Query,
    stack: String
  ): Promise<Array<PriceHistoryEntity>> {
    return await getDocs(reference)
      .then((response) => {
        return response.docs.map((doc) => {
          const object = doc.data();
          return {
            id: doc.id,
            ...object,
          };
        }) as Array<PriceHistoryEntity>;
      })
      .catch((error: FirebaseError) => {
        if (typeof error != 'string') {
          error.message = `${error.message} - ${stack} (${this.path})`;
        }
        LogsService.Create(error);
        throw `Ocorreu um erro enquanto buscávamos o histórico de preços.`;
      });
  }
}

export const PriceHistoryRepository = new PriceHistoryRespositoryImplements();

import { MarketEntity } from '@/server/entities/market';

export type MarketDto = Omit<MarketEntity, ''>;

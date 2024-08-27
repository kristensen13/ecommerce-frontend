import { Store } from '../models/store.model';

export interface ChargeStoresResponse {
  ok: boolean;
  stores: Store[];
}

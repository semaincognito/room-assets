import { load, save } from './storage';
import type { Asset } from '@/types/models';

const KEY = 'assets';

export function getAssets(): Asset[] {
  return load<Asset[]>(KEY, []);
}

export function createAsset(asset: Asset) {
  const assets = getAssets();
  save(KEY, [...assets, asset]);
}

export function deleteAsset(id: string) {
  const assets = getAssets();
  save(KEY, assets.filter(a => a.id !== id));
}
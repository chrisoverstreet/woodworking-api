import DataLoader from 'dataloader';

import { Media } from '../entity/Media';

async function batchMedia(ids: readonly string[]): Promise<(Media | null)[]> {
  const media = await Media.findByIds([...ids], {
    loadRelationIds: { disableMixedMap: true },
  });

  const mediaMap = new Map<string, Media>();
  media.forEach((singleMedia) => mediaMap.set(singleMedia.id, singleMedia));

  return ids.map((id) => mediaMap.get(id) || null);
}

export default function createMediaLoader(): DataLoader<string, Media | null> {
  return new DataLoader<string, Media | null>(batchMedia);
}

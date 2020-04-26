import DataLoader from 'dataloader';

import { WebResult } from '../entity/WebResult';

async function batchWebResults(
  ids: readonly string[],
): Promise<(WebResult | null)[]> {
  const webResults = await WebResult.findByIds([...ids], {
    loadRelationIds: { disableMixedMap: true },
  });

  const webResultsMap = new Map<string, WebResult>();
  webResults.forEach((webResult) => webResultsMap.set(webResult.id, webResult));

  return ids.map((id) => webResultsMap.get(id) || null);
}

export default function createWebResultLoader(): DataLoader<
  string,
  WebResult | null
> {
  return new DataLoader<string, WebResult | null>(batchWebResults);
}

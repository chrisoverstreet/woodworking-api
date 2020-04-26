import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { Media } from '../entity/Media';
import { ProjectMedia } from '../entity/ProjectMedia';

async function batchMedia(projectIds: readonly string[]): Promise<Media[][]> {
  const projectMedia = await ProjectMedia.find({
    where: {
      projectId: {
        id: In([...projectIds]),
      },
    },
    relations: ['media'],
    loadRelationIds: { disableMixedMap: true, relations: ['project'] },
  });

  const projectMediaMap = new Map<string, Media[]>();
  projectMedia.forEach((singleProjectMedia) => {
    const projectMediaList = projectMediaMap.get(singleProjectMedia.project.id);
    if (projectMediaList) {
      projectMediaList.push(singleProjectMedia.media);
    } else {
      projectMediaMap.set(singleProjectMedia.project.id, [
        singleProjectMedia.media,
      ]);
    }
  });

  return projectIds.map((projectId) => projectMediaMap.get(projectId) || []);
}

export default function createMediaByProjectIdLoader(): DataLoader<
  string,
  Media[]
> {
  return new DataLoader<string, Media[]>(batchMedia);
}

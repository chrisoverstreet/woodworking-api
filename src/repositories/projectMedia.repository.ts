import { getManager } from 'typeorm';
import { Stream } from 'stream';

import { Project } from '../entity/Project';
import { ProjectMedia } from '../entity/ProjectMedia';
import { User } from '../entity/User';
import { uploadFile } from '../lib/cloudinary';
import { Media } from '../entity/Media';

interface AddProjectMediaArgs {
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
  project: Project;
  user: User;
}

// eslint-disable-next-line import/prefer-default-export
export async function addProjectMedia({
  file,
  project,
  user,
}: AddProjectMediaArgs): Promise<ProjectMedia> {
  return getManager().transaction(async (transactionEntityManager) => {
    const {
      publicId,
      contentType,
      width,
      height,
      format,
      resourceType,
      bytes,
    } = await uploadFile(file);

    const media = new Media();

    media.publicId = publicId;
    media.user = user;
    media.contentType = contentType;
    media.width = width;
    media.height = height;
    media.format = format;
    media.resourceType = resourceType;
    media.bytes = bytes;

    await transactionEntityManager.save(media);

    const projectMedia = new ProjectMedia();

    projectMedia.project = project;
    projectMedia.media = media;
    projectMedia.user = user;

    await transactionEntityManager.save(projectMedia);

    return projectMedia;
  });
}

import { Stream } from 'stream';

import { Media } from '../entity/Media';
import { User } from '../entity/User';
import { destroy, uploadFile } from '../lib/cloudinary';

interface AddMediaArgs {
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
  user: User | null;
}

export async function addMedia({ file, user }: AddMediaArgs): Promise<Media> {
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
  media.contentType = contentType;
  media.width = width;
  media.height = height;
  media.format = format;
  media.resourceType = resourceType;
  media.bytes = bytes;

  if (user) {
    media.user = user;
  }

  return media.save();
}

interface DeleteMediaArgs {
  id: string;
  publicId: string;
}

export async function deleteMedia({
  id,
  publicId,
}: DeleteMediaArgs): Promise<void> {
  const { affected = 0 } = await Media.delete({ id });

  if (!affected) {
    throw new Error('Failed to delete project');
  }

  // eslint-disable-next-line no-console
  destroy(publicId).catch(console.error);
}

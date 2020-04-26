import { Stream } from 'stream';
import { v2 as cloudinary } from 'cloudinary';

import { Media } from '../entity/Media';
import { User } from '../entity/User';

interface AddMediaArgs {
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
  user: User | null;
}

export async function addMedia({ file, user }: AddMediaArgs): Promise<Media> {
  const { mimetype, createReadStream } = await file;

  const {
    public_id: publicId,
    width,
    height,
    format,
    resource_type: resourceType,
    bytes,
    // info = null,
  } = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // categorization: 'google_tagging',
      },
      (error, image) => {
        if (error) {
          return reject(error);
        }
        return resolve(image);
      },
    );

    createReadStream().pipe(uploadStream);
  });

  const media = new Media();

  media.publicId = publicId;
  media.contentType = mimetype;
  media.width = width;
  media.height = height;
  media.format = format;
  media.resourceType = resourceType;
  media.bytes = bytes;

  media.publicId = publicId;
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
  cloudinary.uploader.destroy(publicId).catch(console.error);
}

import { getManager } from 'typeorm';
import { Stream } from 'stream';

import { Media } from '../entity/Media';
import { uploadFile } from '../lib/cloudinary';
import { User } from '../entity/User';
import { WebResult } from '../entity/WebResult';

interface AddWebResultArgs {
  title: string;
  content: string | undefined;
  author: string | undefined;
  url: string;
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
  user: User;
}

// eslint-disable-next-line import/prefer-default-export
export async function addWebResult({
  title,
  content,
  author,
  url,
  file,
  user,
}: AddWebResultArgs): Promise<WebResult> {
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
    media.contentType = contentType;
    media.width = width;
    media.height = height;
    media.format = format;
    media.resourceType = resourceType;
    media.bytes = bytes;
    media.user = user;

    await transactionEntityManager.save(media);

    const webResult = new WebResult();
    webResult.media = media;
    webResult.title = title;
    webResult.content = content;
    webResult.author = author;
    webResult.url = url;
    webResult.user = user;

    await transactionEntityManager.save(webResult);

    return webResult;
  });
}

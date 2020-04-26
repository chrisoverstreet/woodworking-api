import { AuthenticationError, ValidationError } from 'apollo-server-express';
import { Stream } from 'stream';

import { addMedia, deleteMedia } from '../repositories/media.repository';
import { Context } from '../context';
import { Media } from '../entity/Media';
import { User } from '../entity/User';

function userIdResolver({ user }: Media): string | null {
  return user?.id ?? null;
}

async function userResolver(
  { user }: Media,
  _args: void,
  { UserLoader }: Context,
): Promise<User | null> {
  if (!user?.id) {
    return null;
  }
  return UserLoader.load(user.id);
}

interface AddMediaArgs {
  file: Promise<{
    mimetype: string;
    createReadStream: () => Stream;
  }>;
}

async function addMediaResolver(
  _parent: void,
  { file }: AddMediaArgs,
  { MediaLoader, userId, UserLoader }: Context,
): Promise<Media> {
  if (!userId) {
    throw new AuthenticationError('Not authorized');
  }

  const user = await UserLoader.load(userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const media = await addMedia({ file, user });

  MediaLoader.prime(media.id, media);

  return media;
}

interface MediaArgs {
  id: string;
}

async function mediaResolver(
  _parent: void,
  { id }: MediaArgs,
  { MediaLoader }: Context,
) {
  return MediaLoader.load(id);
}

interface DeleteMediaArgs {
  id: string;
}

async function deleteMediaResolver(
  _parent: void,
  { id }: DeleteMediaArgs,
  { MediaLoader, userId }: Context,
): Promise<string> {
  if (!userId) {
    throw new AuthenticationError('Not authorized');
  }

  const media = await MediaLoader.load(id);

  if (!media) {
    throw new ValidationError('Media not found');
  }
  if (media.user?.id !== userId) {
    throw new AuthenticationError('Not authorized');
  }

  await deleteMedia({ id, publicId: media.publicId });

  return 'Successfully deleted media';
}

export default {
  Media: {
    user: userResolver,
    userId: userIdResolver,
  },
  Query: {
    media: mediaResolver,
  },
  Mutation: {
    addMedia: addMediaResolver,
    deleteMedia: deleteMediaResolver,
  },
};
